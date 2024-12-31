import { faker } from '@faker-js/faker'

import { registerRoute } from '@/src/routes/api/register'
import { generateSiteRequest, MOCK_ENV } from '@/vitest/data-helpers'

const mockInviteService = {
  getInviteById: vi.fn(),
  deleteInvite: vi.fn(),
}

const mockSiteService = {
  getSiteById: vi.fn(),
}

const mockUserService = {
  createUser: vi.fn(),
  addUserSite: vi.fn(),
}

vi.mock('@services/invite-service', () => ({
  InviteService: vi.fn().mockImplementation(() => mockInviteService),
}))

vi.mock('@services/site-service', () => ({
  SiteService: vi.fn().mockImplementation(() => mockSiteService),
}))

vi.mock('@services/user-service', () => ({
  UserService: vi.fn().mockImplementation(() => mockUserService),
}))

describe('register route', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })
  it('should return 400 if invalid invite id', async () => {
    mockInviteService.getInviteById.mockResolvedValue(undefined)
    const response = await registerRoute.request(
      '/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteId: faker.string.uuid(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
        }),
      },
      MOCK_ENV,
    )
    expect(response.status).toBe(400)
  })

  it('should return 200 if valid request', async () => {
    mockInviteService.getInviteById.mockResolvedValue({
      id: faker.string.uuid(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(['admin', 'contributor']),
    })

    mockInviteService.deleteInvite.mockResolvedValue(true)

    const response = await registerRoute.request(
      '/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteId: faker.string.uuid(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
        }),
      },
      MOCK_ENV,
    )
    expect(response.status).toBe(200)
    expect(await response.text()).toMatchSnapshot()
  })

  it('should add site link if siteId provided', async () => {
    mockInviteService.getInviteById.mockResolvedValue({
      id: faker.string.uuid(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(['admin', 'contributor']),
      siteId: faker.string.uuid(),
    })

    mockInviteService.deleteInvite.mockResolvedValue(true)

    const mockSite = {
      ...generateSiteRequest(),
      cmsUrl: 'https://example.com',
    }
    mockSiteService.getSiteById.mockResolvedValue(mockSite)

    mockUserService.addUserSite.mockResolvedValue(true)
    mockUserService.createUser.mockResolvedValue({
      id: faker.string.uuid(),
    })

    const response = await registerRoute.request(
      '/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteId: faker.string.uuid(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          siteId: faker.string.uuid(),
        }),
      },
      MOCK_ENV,
    )
    expect(response.status).toBe(200)
    expect(await response.text()).toMatchSnapshot()
  })
})
