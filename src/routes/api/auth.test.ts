import { faker } from '@faker-js/faker'

import { adminAuthRoute } from '@/src/routes/api/auth'
import { MOCK_ENV } from '@/vitest/data-helpers'
import { hashPassword } from '@services/encryption-service'

const mockedUserService = {
  getUserByEmail: vi.fn(),
}
vi.mock('@services/user-service', () => {
  return {
    UserService: vi.fn().mockImplementation(() => mockedUserService),
  }
})

describe('auth route', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })
  it('should return 401 if invalid credentials', async () => {
    const response = await adminAuthRoute.request(
      '/',
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa('admin@admin.com:password')}`,
        },
      },
      MOCK_ENV,
    )
    expect(response.status).toBe(401)
  })

  it('should return 401 if not admin role', async () => {
    const password = faker.internet.password()
    const fakeUser = {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      role: 'contributor',
      password: hashPassword(password, MOCK_ENV.AUTH_SECRET_KEY!),
    }
    mockedUserService.getUserByEmail.mockResolvedValue(fakeUser)

    const response = await adminAuthRoute.request(
      '/',
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(`${fakeUser.email}:${password}`)}`,
        },
      },
      MOCK_ENV,
    )
    expect(response.status).toBe(401)
  })

  it('should return 200 if valid credentials', async () => {
    const password = faker.internet.password()
    const fakeUser = {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      role: 'admin',
      password: hashPassword(password, MOCK_ENV.AUTH_SECRET_KEY!),
    }
    mockedUserService.getUserByEmail.mockResolvedValue(fakeUser)
    const response = await adminAuthRoute.request(
      '/',
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(`${fakeUser.email}:${password}`)}`,
        },
      },
      MOCK_ENV,
    )
    expect(response.status).toBe(200)
  })
})
