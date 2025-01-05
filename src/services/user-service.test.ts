import { faker } from '@faker-js/faker'
import { env } from 'cloudflare:test'
import { drizzle } from 'drizzle-orm/d1'
import { seed } from 'drizzle-seed'

import { generateSiteRequest, generateUserCreateRequest } from '@/vitest/data-helpers'
import { users } from '@db/users'
import { SiteService } from '@services/site-service'
import { UserService } from '@services/user-service'

describe('user service', () => {
  describe('createUser', () => {
    it('should be able to create user', async () => {
      const userService = UserService(env.DB, env.AUTH_SECRET_KEY!)
      const user = await userService.createUser(generateUserCreateRequest())
      expect(user).toBeDefined()
      expect(user.id).toBeDefined()
    })

    it('should throw error if email already exists', async () => {
      const userService = UserService(env.DB, env.AUTH_SECRET_KEY!)
      const createUserRequest = generateUserCreateRequest()
      await userService.createUser(createUserRequest)
      await expect(userService.createUser(createUserRequest)).rejects.toThrow(
        'UNIQUE constraint failed: users.email',
      )
    })
  })

  describe('getUserById', () => {
    it('should return undefined if user does not exist', async () => {
      const userService = UserService(env.DB, env.AUTH_SECRET_KEY!)
      const user = await userService.getUserById(faker.string.uuid())
      expect(user).toBeUndefined()
    })

    it('should return user if it exists', async () => {
      const userService = UserService(env.DB, env.AUTH_SECRET_KEY!)
      const createUserRequest = generateUserCreateRequest()
      const createdUser = await userService.createUser(createUserRequest)
      const user = await userService.getUserById(createdUser.id)

      expect(user).toBeDefined()
      expect(user!.id).toBe(createdUser.id)
      expect(user!.email).toBe(createUserRequest.email)
      expect(user!.firstName).toBe(createUserRequest.firstName)
      expect(user!.lastName).toBe(createUserRequest.lastName)
      expect(user!.role).toBe(createUserRequest.role)
    })

    it('should return sites if user added to the sites', async () => {
      const userService = UserService(env.DB, env.AUTH_SECRET_KEY!)
      const createUserRequest = generateUserCreateRequest()
      const createdUser = await userService.createUser(createUserRequest)

      const siteService = SiteService(env.DB, env.AUTH_SECRET_KEY!)
      const createdSite = await siteService.createSite(generateSiteRequest())

      await userService.addUserSite(createdUser.id, createdSite.id)

      const user = await userService.getUserById(createdUser.id)

      expect(user).toBeDefined()
      expect(user!.id).toBe(createdUser.id)
    })
  })

  describe('getUserByEmailAndSite', () => {
    it('should return undefined if user does not exist', async () => {
      const userService = UserService(env.DB, env.AUTH_SECRET_KEY!)
      const user = await userService.getUserByEmailAndSite(
        faker.internet.email(),
        faker.string.uuid(),
      )
      expect(user).toBeUndefined()
    })

    it('should return user if it exists', async () => {
      const userService = UserService(env.DB, env.AUTH_SECRET_KEY!)
      const createUserRequest = generateUserCreateRequest()
      const createdUser = await userService.createUser(createUserRequest)

      const siteService = SiteService(env.DB, env.AUTH_SECRET_KEY!)
      const createdSite = await siteService.createSite(generateSiteRequest())

      await userService.addUserSite(createdUser.id, createdSite.id)

      const user = await userService.getUserByEmailAndSite(createUserRequest.email, createdSite.id)

      expect(user).toBeDefined()
      expect(user!.id).toBe(createdUser.id)
      expect(user!.sites[0].id).toBe(createdSite.id)
    })
  })

  describe('getAllUser', () => {
    it('should return empty array if no user exists', async () => {
      const userService = UserService(env.DB, env.AUTH_SECRET_KEY!)
      const user = await userService.getAllUser()
      expect(user).toEqual([])
    })

    it('should return all users', async () => {
      const userService = UserService(env.DB, env.AUTH_SECRET_KEY!)
      await seed(drizzle(env.DB), { users }, { count: 5 })
      const user = await userService.getAllUser()
      expect(user).toHaveLength(5)
    })
  })

  describe('updateUser', () => {
    it('should return null if user does not exist', async () => {
      const userService = UserService(env.DB, env.AUTH_SECRET_KEY!)
      const result = await userService.updateUser(faker.string.uuid(), {})
      expect(result).toBeNull()
    })

    it('should return updated user if user updated', async () => {
      const userService = UserService(env.DB, env.AUTH_SECRET_KEY!)
      const user = await userService.createUser(generateUserCreateRequest())

      const updateUserRequest = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: faker.helpers.arrayElement(['admin', 'contributor']),
      }
      const result = await userService.updateUser(user.id, updateUserRequest)
      expect(result?.firstName).toBe(updateUserRequest.firstName)
      expect(result?.lastName).toBe(updateUserRequest.lastName)
      expect(result?.role).toBe(updateUserRequest.role)
    })
  })

  describe('deleteUser', () => {
    it('should return false if user does not exist', async () => {
      const userService = UserService(env.DB, env.AUTH_SECRET_KEY!)
      const result = await userService.deleteUser(faker.string.uuid())
      expect(result).toBe(false)
    })

    it('should return true if user deleted', async () => {
      const userService = UserService(env.DB, env.AUTH_SECRET_KEY!)
      const user = await userService.createUser(generateUserCreateRequest())
      const result = await userService.deleteUser(user.id)
      expect(result).toBe(true)
    })
  })

  describe('addUserSite', () => {
    it('should return false if user does not exist', async () => {
      const userService = UserService(env.DB, env.AUTH_SECRET_KEY!)
      await expect(() =>
        userService.addUserSite(faker.string.uuid(), faker.string.uuid()),
      ).rejects.toThrowError('FOREIGN KEY')
    })

    it('should return false if site does not exist', async () => {
      const userService = UserService(env.DB, env.AUTH_SECRET_KEY!)
      const user = await userService.createUser(generateUserCreateRequest())
      await expect(() =>
        userService.addUserSite(user.id, faker.string.uuid()),
      ).rejects.toThrowError('FOREIGN KEY')
    })

    it('should return true if user and site exists', async () => {
      const userService = UserService(env.DB, env.AUTH_SECRET_KEY!)
      const user = await userService.createUser(generateUserCreateRequest())
      const siteService = SiteService(env.DB, env.AUTH_SECRET_KEY!)
      const site = await siteService.createSite(generateSiteRequest())
      const result = await userService.addUserSite(user.id, site.id)
      expect(result).toBe(true)
    })
  })
})
