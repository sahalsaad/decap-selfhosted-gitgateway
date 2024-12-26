import { faker } from '@faker-js/faker'
import { usersRoute } from '@/src/routes/api/users'
import {
  mockAdminToken,
  mockContributorToken,
  generateUserCreateRequest,
  MOCK_ENV,
} from '@/vitest/data-helpers'

const mockUserService = {
  getAllUser: vi.fn(),
  getUserById: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
}

vi.mock('@services/user-service', () => ({
  UserService: vi.fn().mockImplementation(() => mockUserService),
}))

describe('users route', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })
  describe('getUsers', () => {
    it('should return 401 if invalid token', async () => {
      const response = await usersRoute.request(
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
      const response = await usersRoute.request(
        '/',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${mockContributorToken}`,
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return user list if valid request', async () => {
      const numberOfUsers = faker.number.int({ min: 1, max: 10 })
      const userLists = Array.from({ length: numberOfUsers }, () => ({
        id: faker.string.uuid(),
        ...generateUserCreateRequest(),
      }))
      mockUserService.getAllUser.mockResolvedValue(userLists)

      const response = await usersRoute.request(
        '/',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(200)
      expect(await response.json()).toStrictEqual(userLists)
    })
  })

  describe('getUser', () => {
    it('should return 401 if invalid token', async () => {
      const response = await usersRoute.request(
        '/:userId',
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
      const response = await usersRoute.request(
        '/:userId',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${mockContributorToken}`,
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return 404 if user does not exist', async () => {
      mockUserService.getUserById.mockResolvedValue(undefined)

      const response = await usersRoute.request(
        '/' + faker.string.uuid(),
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(404)
    })

    it('should return user if valid request', async () => {
      const userId = faker.string.uuid()
      const user = {
        ...generateUserCreateRequest(),
        id: userId,
      }
      mockUserService.getUserById.mockResolvedValue(user)

      const response = await usersRoute.request(
        '/' + userId,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(200)
      expect(await response.json()).toStrictEqual(user)
    })
  })
  describe('updateUser', () => {
    it('should return 401 if invalid token', async () => {
      const response = await usersRoute.request(
        '/:userId',
        {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer invalid',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firstName: faker.person.firstName() }),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return 401 if not admin', async () => {
      const response = await usersRoute.request(
        '/:userId',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${mockContributorToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firstName: faker.person.firstName() }),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return 404 if user does not exist', async () => {
      mockUserService.updateUser.mockResolvedValue(false)

      const response = await usersRoute.request(
        '/' + faker.string.uuid(),
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firstName: faker.person.firstName() }),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(404)
    })

    it('should return 204 if user updated', async () => {
      const userId = faker.string.uuid()
      mockUserService.updateUser.mockResolvedValue(true)

      const response = await usersRoute.request(
        '/' + userId,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firstName: faker.person.firstName() }),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(204)
    })

    it('should return 400 if invalid request', async () => {
      const userId = faker.string.uuid()

      const response = await usersRoute.request(
        '/' + userId,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role: 'invalid' }),
        },
        MOCK_ENV
      )
      expect(response.status).toBe(400)
    })
  })

  describe('deleteUser', () => {
    it('should return 401 if invalid token', async () => {
      const response = await usersRoute.request(
        '/:userId',
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
      const response = await usersRoute.request(
        '/' + faker.string.uuid(),
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${mockContributorToken}`,
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(401)
    })

    it('should return 404 if user does not exist', async () => {
      mockUserService.deleteUser.mockResolvedValue(false)

      const response = await usersRoute.request(
        '/' + faker.string.uuid(),
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(404)
    })

    it('should return 204 if user deleted', async () => {
      const userId = faker.string.uuid()
      mockUserService.deleteUser.mockResolvedValue(true)

      const response = await usersRoute.request(
        '/' + userId,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${mockAdminToken}`,
          },
        },
        MOCK_ENV
      )
      expect(response.status).toBe(204)
    })
  })
})
