import { inviteRoute } from '@/src/routes/api/invite'
import { env } from 'cloudflare:test'
import { sign } from 'hono/jwt'
import { faker } from '@faker-js/faker'

const fakeSecret = faker.string.uuid()
const MOCK_ENV = {
  DB: env.DB,
  AUTH_SECRET_KEY: fakeSecret,
}

const fakeToken = await sign({ user: { id: 'fake-user-id' } }, fakeSecret)

describe('invite route', () => {
  describe('createInvite', () => {
    it('should return 400 if invalid role', async () => {
      const response = await inviteRoute.request(
        '/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${fakeToken}`,
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
            Authorization: `Bearer invalid`,
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
            Authorization: `Bearer ${fakeToken}`,
          },
          body: JSON.stringify({ role: faker.helpers.arrayElement(['admin', 'contributor']) }),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(201)
    })
  })
})
