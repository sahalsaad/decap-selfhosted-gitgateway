import { faker } from '@faker-js/faker'

import accountRoutes from '@/src/routes/api/admin/account/account.routes'
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
      const response = await accountRoutes.request(
        '/reset-password',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer invalid',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: faker.internet.email() }),
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(401)
    })

    it('should return 401 if not admin', async () => {
      const response = await accountRoutes.request(
        '/reset-password',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mockContributorToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: faker.internet.email() }),
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(401)
    })

    it('should return 404 if email not found', async () => {
      mockUserService.setPassword.mockResolvedValue(false)

      const response = await accountRoutes.request(
        '/reset-password',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mockAdminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: faker.internet.email() }),
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(404)
    })

    it('should return temporary password', async () => {
      mockUserService.setPassword.mockResolvedValue(true)

      const response = await accountRoutes.request(
        '/reset-password',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mockAdminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: faker.internet.email() }),
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(200)
      expect(await response.json()).toStrictEqual({ temporaryPassword: expect.any(String) })
    })
  })

  describe('createInvite', () => {
    it('should return 400 if invalid role', async () => {
      const response = await accountRoutes.request(
        '/invite',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockAdminToken}`,
          },
          body: JSON.stringify({ role: 'invalid' }),
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(400)
    })

    it('should return 401 if not admin', async () => {
      const response = await accountRoutes.request(
        '/invite',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockContributorToken}`,
          },
          body: JSON.stringify({ role: faker.helpers.arrayElement(['admin', 'contributor']) }),
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(401)
    })

    it('should return 401 if invalid token', async () => {
      const response = await accountRoutes.request(
        '/invite',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer invalid',
          },
          body: JSON.stringify({ role: 'invalid' }),
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(401)
    })

    it('should return 201 if valid request', async () => {
      const response = await accountRoutes.request(
        '/invite',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockAdminToken}`,
          },
          body: JSON.stringify({ role: faker.helpers.arrayElement(['admin', 'contributor']) }),
        },
        MOCK_ENV,
      )
      expect(response.status).toBe(201)
    })
  })
})
