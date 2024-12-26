import { faker } from '@faker-js/faker'
import { decode } from 'hono/jwt'
import { expect } from 'vitest'
import { gitGatewayAuthRoute } from '@/src/routes/gitgateway/auth'
import { fakeUserAndSiteData, MOCK_ENV } from '@/vitest/data-helpers'

const mockedUserService = {
  getUserByEmailAndSite: vi.fn(),
}
vi.mock('@services/user-service', () => {
  return {
    UserService: vi.fn().mockImplementation(() => mockedUserService),
  }
})

describe('auth route', () => {
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
    const fakeUser = fakeUserAndSiteData(password)
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
    const fakeUser = fakeUserAndSiteData(password)
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
