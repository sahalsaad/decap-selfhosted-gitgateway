import { faker } from '@faker-js/faker'
import { decode } from 'hono/jwt'
import { expect } from 'vitest'
import { gitGatewayAuthRoute } from '@/src/routes/gitgateway/auth'
import {
  mockUserAndSiteData,
  MOCK_ENV,
  mockAdminPayloadData,
  mockAdminToken,
} from '@/vitest/data-helpers'

const mockedUserService = {
  getUserByEmailAndSite: vi.fn(),
}
vi.mock('@services/user-service', () => {
  return {
    UserService: vi.fn().mockImplementation(() => mockedUserService),
  }
})

describe('auth route', () => {
  describe('token endpoint', () => {
    it('should return 401 if invalid credentials', async () => {
      mockedUserService.getUserByEmailAndSite.mockResolvedValue(undefined)

      const loginInfo = new FormData()
      loginInfo.set('username', faker.internet.email())
      loginInfo.set('password', faker.internet.password())
      const response = await gitGatewayAuthRoute.request(
        '/token',
        {
          method: 'POST',
          body: loginInfo,
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return 401 if wrong password', async () => {
      const password = faker.internet.password()
      const fakeUser = mockUserAndSiteData(password)
      mockedUserService.getUserByEmailAndSite.mockResolvedValue(fakeUser)

      const loginInfo = new FormData()
      loginInfo.set('username', fakeUser.email)
      loginInfo.set('password', faker.internet.password())
      const response = await gitGatewayAuthRoute.request(
        '/token',
        {
          method: 'POST',
          body: loginInfo,
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return jwt data if valid credentials', async () => {
      const password = faker.internet.password()
      const fakeUser = mockUserAndSiteData(password)
      mockedUserService.getUserByEmailAndSite.mockResolvedValue(fakeUser)

      const loginInfo = new FormData()
      loginInfo.set('username', fakeUser.email)
      loginInfo.set('password', password)
      const response = await gitGatewayAuthRoute.request(
        '/token',
        {
          method: 'POST',
          body: loginInfo,
        },
        MOCK_ENV
      )
      expect(response.status).toBe(200)
      const jwtData: JwtResponse = await response.json()
      expect(jwtData).toStrictEqual({
        token_type: 'bearer',
        access_token: expect.any(String),
        expires_in: expect.any(Number),
      })

      const jwt = decode(jwtData.access_token)
      expect(jwt.payload).toStrictEqual({
        user: {
          id: fakeUser.id,
          email: fakeUser.email,
          firstName: fakeUser.firstName,
          lastName: fakeUser.lastName,
          role: fakeUser.role,
        },
        git: {
          token: fakeUser.sites[0].gitToken,
          provider: fakeUser.sites[0].gitProvider,
          host: fakeUser.sites[0].gitHost,
          repo: fakeUser.sites[0].gitRepo,
        },
        exp: expect.any(Number),
      })
    })
  })

  describe('user endpoint', () => {
    it('should return 401 if invalid token', async () => {
      const response = await gitGatewayAuthRoute.request(
        '/user',
        {
          method: 'GET',
          headers: {
            Authorization: 'Barear invalid',
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return user data if valid token', async () => {
      const mockUserData = mockAdminPayloadData
      mockedUserService.getUserByEmailAndSite.mockResolvedValue(mockUserData)

      const response = await gitGatewayAuthRoute.request(
        '/user',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(200)
      const userData: UserResponse = await response.json()
      expect(userData).toStrictEqual({
        email: mockUserData.user.email,
        first_name: mockUserData.user.firstName,
        last_name: mockUserData.user.lastName,
        provider: mockUserData.git.provider,
        user_metadata: {
          full_name: `${mockUserData.user.firstName} ${mockUserData.user.lastName}`,
        },
      })
    })
  })
})
