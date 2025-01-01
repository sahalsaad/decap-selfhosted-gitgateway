import { faker } from '@faker-js/faker'

import type { SiteCreatedResponse, SiteGetResponse } from '@/types/sites'

import siteRoutes from '@/src/routes/api/admin/sites/site.routes'
import {
  generateSiteRequest,
  MOCK_ENV,
  mockAdminToken,
  mockContributorToken,
} from '@/vitest/data-helpers'

const mockedSiteService = {
  getAllSite: vi.fn(),
  createSite: vi.fn(),
  getSiteById: vi.fn(),
  deleteSite: vi.fn(),
  updateSite: vi.fn(),
}
vi.mock('@services/site-service', () => {
  return {
    SiteService: vi.fn().mockImplementation(() => mockedSiteService),
  }
})

const mockedUserService = {
  addUserSite: vi.fn(),
}
vi.mock('@services/user-service', () => {
  return {
    UserService: vi.fn().mockImplementation(() => mockedUserService),
  }
})

describe('sites route', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getSites', () => {
    it('should return 401 if invalid token', async () => {
      const response = await siteRoutes.request(
        '/',
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer invalid',
          },
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(401)
    })

    it('should return 401 if not admin', async () => {
      const response = await siteRoutes.request(
        `/${faker.string.uuid()}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${mockContributorToken}`,
          },
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(401)
    })

    it('should return all the sites', async () => {
      mockedSiteService.getAllSite.mockResolvedValue(
        Array.from({ length: 10 }, () => ({
          id: faker.string.uuid(),
          createdAt: faker.date.recent().toISOString(),
          ...generateSiteRequest(),
        })),
      )

      const response = await siteRoutes.request(
        '/',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
          },
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(200)
      expect(await response.json()).toHaveLength(10)
    })
  })

  describe('createSite', () => {
    it('should return 401 if invalid token', async () => {
      const response = await siteRoutes.request(
        '/',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer invalid',
          },
          body: JSON.stringify(generateSiteRequest()),
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(401)
    })

    it('should return 401 if not admin', async () => {
      const response = await siteRoutes.request(
        '/',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mockContributorToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(generateSiteRequest()),
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(401)
    })

    it('should return 400 if invalid request', async () => {
      const response = await siteRoutes.request(
        '/',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mockAdminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ gitProvider: 'gitea' }),
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(400)
    })

    it('should return 201 if site created', async () => {
      const mockedSite = {
        id: faker.string.uuid(),
        ...generateSiteRequest(),
      }
      mockedSiteService.createSite.mockResolvedValue(mockedSite)
      mockedUserService.addUserSite.mockResolvedValue(true)

      const response = await siteRoutes.request(
        '/',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mockAdminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(generateSiteRequest()),
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(201)
      expect((await response.json<SiteCreatedResponse>()).id).toBe(
        mockedSite.id,
      )
    })
  })

  describe('getSite', () => {
    it('should return 401 if invalid token', async () => {
      const response = await siteRoutes.request(
        `/${faker.string.uuid()}`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer invalid',
          },
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(401)
    })

    it('should return 401 if not admin', async () => {
      const response = await siteRoutes.request(
        `/${faker.string.uuid()}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${mockContributorToken}`,
          },
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(401)
    })

    it('should return 404 if site does not exist', async () => {
      mockedSiteService.getSiteById.mockResolvedValue(undefined)
      const response = await siteRoutes.request(
        `/${faker.string.uuid()}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
          },
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(404)
    })

    it('should return 200 if site exists', async () => {
      const mockedSite = {
        id: faker.string.uuid(),
        createdAt: faker.date.recent().toISOString(),
        ...generateSiteRequest(),
      }
      mockedSiteService.getSiteById.mockResolvedValue(mockedSite)

      const response = await siteRoutes.request(
        `/${mockedSite.id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
          },
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(200)
      const { gitToken, ...site } = mockedSite
      expect(await response.json<SiteGetResponse>()).toStrictEqual(site)
    })
  })

  describe('deleteSite', () => {
    it('should return 401 if invalid token', async () => {
      const response = await siteRoutes.request(
        `/${faker.string.uuid()}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer invalid',
          },
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(401)
    })

    it('should return 401 if not admin', async () => {
      const response = await siteRoutes.request(
        `/${faker.string.uuid()}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${mockContributorToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(generateSiteRequest()),
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(401)
    })

    it('should return 404 if site does not exist', async () => {
      mockedSiteService.deleteSite.mockResolvedValue(false)
      const response = await siteRoutes.request(
        `/${faker.string.uuid()}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
          },
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(404)
    })

    it('should return 204 if site deleted', async () => {
      mockedSiteService.deleteSite.mockResolvedValue(true)
      const response = await siteRoutes.request(
        `/${faker.string.uuid()}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
          },
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(204)
    })
  })
  describe('updateSite', () => {
    it('should return 401 if invalid token', async () => {
      const response = await siteRoutes.request(
        `/${faker.string.uuid()}`,
        {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer invalid',
          },
          body: JSON.stringify(generateSiteRequest()),
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(401)
    })

    it('should return 401 if not admin', async () => {
      const response = await siteRoutes.request(
        `/${faker.string.uuid()}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${mockContributorToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(generateSiteRequest()),
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(401)
    })

    it('should return 404 if site does not exist', async () => {
      mockedSiteService.updateSite.mockResolvedValue(false)
      const response = await siteRoutes.request(
        `/${faker.string.uuid()}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${mockAdminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(generateSiteRequest()),
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(404)
    })

    it('should return 204 if site updated', async () => {
      mockedSiteService.updateSite.mockResolvedValue(true)
      const response = await siteRoutes.request(
        `/${faker.string.uuid()}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${mockAdminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(generateSiteRequest()),
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(204)
    })
  })
})
