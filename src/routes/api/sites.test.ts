import { faker } from '@faker-js/faker'
import { sitesRoute } from '@/src/routes/api/sites'
import type { SiteCreatedResponse, SiteGetResponse } from '@/types/sites'
import {
  fakeAdminToken,
  fakeContributorToken,
  generateSiteRequest,
  MOCK_ENV,
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
      const response = await sitesRoute.request(
        '/',
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer invalid',
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return 401 if not admin', async () => {
      const response = await sitesRoute.request(
        '/' + faker.string.uuid(),
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${fakeContributorToken}`,
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return all the sites', async () => {
      mockedSiteService.getAllSite.mockResolvedValue(
        Array.from({ length: 10 }, () => ({
          id: faker.string.uuid(),
          cmsUrl: faker.internet.url(),
          gitProvider: faker.helpers.arrayElement(['github', 'gitlab', 'bitbucket']),
        }))
      )

      const response = await sitesRoute.request(
        '/',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${fakeAdminToken}`,
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(200)
      expect(await response.json()).toHaveLength(10)
    })
  })

  describe('createSite', () => {
    it('should return 401 if invalid token', async () => {
      const response = await sitesRoute.request(
        '/',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer invalid',
          },
          body: JSON.stringify(generateSiteRequest()),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return 401 if not admin', async () => {
      const response = await sitesRoute.request(
        '/',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${fakeContributorToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(generateSiteRequest()),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return 400 if invalid request', async () => {
      const response = await sitesRoute.request(
        '/',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${fakeAdminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ gitProvider: 'gitea' }),
        },
        MOCK_ENV
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

      const response = await sitesRoute.request(
        '/',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${fakeAdminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(generateSiteRequest()),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(201)
      expect((await response.json<SiteCreatedResponse>()).id).toBe(mockedSite.id)
    })
  })

  describe('getSite', () => {
    it('should return 401 if invalid token', async () => {
      const response = await sitesRoute.request(
        '/' + faker.string.uuid(),
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer invalid',
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return 401 if not admin', async () => {
      const response = await sitesRoute.request(
        '/' + faker.string.uuid(),
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${fakeContributorToken}`,
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return 404 if site does not exist', async () => {
      mockedSiteService.getSiteById.mockResolvedValue(undefined)
      const response = await sitesRoute.request(
        '/' + faker.string.uuid(),
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${fakeAdminToken}`,
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(404)
    })

    it('should return 200 if site exists', async () => {
      const mockedSite = {
        id: faker.string.uuid(),
        ...generateSiteRequest(),
      }
      mockedSiteService.getSiteById.mockResolvedValue(mockedSite)

      const response = await sitesRoute.request(
        '/' + mockedSite.id,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${fakeAdminToken}`,
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(200)
      expect(await response.json<SiteGetResponse>()).toStrictEqual(mockedSite)
    })
  })

  describe('deleteSite', () => {
    it('should return 401 if invalid token', async () => {
      const response = await sitesRoute.request(
        '/' + faker.string.uuid(),
        {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer invalid',
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return 401 if not admin', async () => {
      const response = await sitesRoute.request(
        '/' + faker.string.uuid(),
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${fakeContributorToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(generateSiteRequest()),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return 404 if site does not exist', async () => {
      mockedSiteService.deleteSite.mockResolvedValue(false)
      const response = await sitesRoute.request(
        '/' + faker.string.uuid(),
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${fakeAdminToken}`,
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(404)
    })

    it('should return 204 if site deleted', async () => {
      mockedSiteService.deleteSite.mockResolvedValue(true)
      const response = await sitesRoute.request(
        '/' + faker.string.uuid(),
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${fakeAdminToken}`,
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(204)
    })
  })
  describe('updateSite', () => {
    it('should return 401 if invalid token', async () => {
      const response = await sitesRoute.request(
        '/' + faker.string.uuid(),
        {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer invalid',
          },
          body: JSON.stringify(generateSiteRequest()),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return 401 if not admin', async () => {
      const response = await sitesRoute.request(
        '/' + faker.string.uuid(),
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${fakeContributorToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(generateSiteRequest()),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return 404 if site does not exist', async () => {
      mockedSiteService.updateSite.mockResolvedValue(false)
      const response = await sitesRoute.request(
        '/' + faker.string.uuid(),
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${fakeAdminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(generateSiteRequest()),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(404)
    })

    it('should return 204 if site updated', async () => {
      mockedSiteService.updateSite.mockResolvedValue(true)
      const response = await sitesRoute.request(
        '/' + faker.string.uuid(),
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${fakeAdminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(generateSiteRequest()),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(204)
    })
  })
})
