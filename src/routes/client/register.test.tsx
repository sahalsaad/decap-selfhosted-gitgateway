import { faker } from '@faker-js/faker'
import { registerClient } from '@/src/routes/client/register'
import { MOCK_ENV } from '@/vitest/data-helpers'

const mockInviteService = {
  getInviteById: vi.fn(),
}

vi.mock('@services/invite-service', () => ({
  InviteService: vi.fn().mockImplementation(() => mockInviteService),
}))

describe('register route', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })
  it('should return 400 if no invite id', async () => {
    const response = await registerClient.request(
      '/?invite=',
      {
        method: 'GET',
      },
      MOCK_ENV
    )
    expect(await response.text()).toMatchSnapshot()
  })
  it('should return 400 if invalid invite id', async () => {
    mockInviteService.getInviteById.mockResolvedValue(undefined)
    const response = await registerClient.request(
      '/?invite=' + faker.string.uuid(),
      {
        method: 'GET',
      },
      MOCK_ENV
    )
    expect(await response.text()).toMatchSnapshot()
  })

  it('should return register form if valid invite id', async () => {
    const mockInvite = {
      id: 'fix-invite-id',
      email: 'email@email.com',
      role: faker.helpers.arrayElement(['admin', 'contributor']),
    }
    mockInviteService.getInviteById.mockResolvedValue(mockInvite)
    const response = await registerClient.request(
      '/?invite=' + mockInvite.id,
      {
        method: 'GET',
      },
      MOCK_ENV
    )
    expect(await response.text()).toMatchSnapshot()
  })

  it('should disable email if invite contains email', async () => {
    const mockInvite = {
      id: 'fix-invite-id',
      email: 'email@email.com',
      role: faker.helpers.arrayElement(['admin', 'contributor']),
    }
    mockInviteService.getInviteById.mockResolvedValue(mockInvite)
    const response = await registerClient.request(
      '/?invite=' + mockInvite.id,
      {
        method: 'GET',
      },
      MOCK_ENV
    )
    expect(await response.text()).toMatchSnapshot()
  })

  it('should enable email if invite does not contain email', async () => {
    const mockInvite = {
      id: 'fix-invite-id',
      email: null,
      role: faker.helpers.arrayElement(['admin', 'contributor']),
    }
    const response = await registerClient.request(
      '/?invite=' + mockInvite.id,
      {
        method: 'GET',
      },
      MOCK_ENV
    )
    expect(await response.text()).toMatchSnapshot()
  })
})
