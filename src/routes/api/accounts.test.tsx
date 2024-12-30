import { faker } from '@faker-js/faker'
import { hashPassword } from '@services/encryption-service'
import { accountsRoute } from '@/src/routes/api/accounts'
import { MOCK_ENV, mockAdminToken, mockContributorToken } from '@/vitest/data-helpers'

const mockUserService = {
  getUserByEmail: vi.fn(),
  setPassword: vi.fn(),
}

vi.mock('@services/user-service', () => ({
  UserService: vi.fn().mockImplementation(() => mockUserService),
}))

describe('accounts route', () => {
  describe('resetPassword', () => {
    it('should return 401 if invalid token', async () => {
      const response = await accountsRoute.request(
        '/reset-password',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer invalid',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: faker.internet.email() }),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return 401 if not admin', async () => {
      const response = await accountsRoute.request(
        '/reset-password',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mockContributorToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: faker.internet.email() }),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return 400 if email not found', async () => {
      mockUserService.setPassword.mockResolvedValue(false)

      const response = await accountsRoute.request(
        '/reset-password',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: faker.internet.email() }),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(400)
    })

    it('should return temporary password', async () => {
      mockUserService.setPassword.mockResolvedValue(true)

      const response = await accountsRoute.request(
        '/reset-password',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: faker.internet.email() }),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(200)
      expect(await response.json()).toStrictEqual({ temporaryPassword: expect.any(String) })
    })
  })

  describe('setPassword', () => {
    it('should return user not found if wrong email', async () => {
      mockUserService.getUserByEmail.mockResolvedValue(undefined)

      const response = await accountsRoute.request(
        '/set-password',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: faker.internet.email(),
            currentPassword: faker.internet.password(),
            newPassword: faker.internet.password(),
          }),
        },
        MOCK_ENV
      )
      expect(await response.text()).toMatchSnapshot()
    })

    it('should return incorrect password if invalid existing password', async () => {
      mockUserService.getUserByEmail.mockResolvedValue({
        id: faker.string.uuid(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: faker.helpers.arrayElement(['admin', 'contributor']),
        password: hashPassword(faker.internet.password(), MOCK_ENV.AUTH_SECRET_KEY!),
      })

      const response = await accountsRoute.request(
        '/set-password',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: faker.internet.email(),
            currentPassword: faker.internet.password(),
            newPassword: faker.internet.password(),
          }),
        },
        MOCK_ENV
      )
      expect(await response.text()).toMatchSnapshot()
    })

    it('should return errors if wrong request payload', async () => {
      const response = await accountsRoute.request(
        '/set-password',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        },
        MOCK_ENV
      )
      expect(await response.text()).toMatchSnapshot()
    })

    it('should return success if password updated', async () => {
      const password = faker.internet.password()
      mockUserService.getUserByEmail.mockResolvedValue({
        id: faker.string.uuid(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: faker.helpers.arrayElement(['admin', 'contributor']),
        password: hashPassword(password, MOCK_ENV.AUTH_SECRET_KEY!),
      })
      mockUserService.setPassword.mockResolvedValue(true)

      const response = await accountsRoute.request(
        '/set-password',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: faker.internet.email(),
            currentPassword: password,
            newPassword: faker.internet.password(),
          }),
        },
        MOCK_ENV
      )
      expect(await response.text()).toMatchSnapshot()
    })
  })
})
