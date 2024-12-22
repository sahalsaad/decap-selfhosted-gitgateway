import { faker } from '@faker-js/faker'
import { inviteRoute } from '@/src/routes/api/invite'
import { fakeAdminToken, MOCK_ENV } from '@/vitest/data-helpers'

describe('invite route', () => {
  describe('createInvite', () => {
    it('should return 400 if invalid role', async () => {
      const response = await inviteRoute.request(
        '/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${fakeAdminToken}`,
          },
          body: JSON.stringify({ role: 'invalid' }),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(400)
    })

    it('should return 401 if invalid token', async () => {
      const response = await inviteRoute.request(
        '/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer invalid',
          },
          body: JSON.stringify({ role: 'invalid' }),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return 201 if valid request', async () => {
      const response = await inviteRoute.request(
        '/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${fakeAdminToken}`,
          },
          body: JSON.stringify({ role: faker.helpers.arrayElement(['admin', 'contributor']) }),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(201)
    })
  })
})
