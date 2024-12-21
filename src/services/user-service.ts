import { sites } from '@db/sites'
import { users } from '@db/users'
import { usersToSites } from '@db/users-sites'
import { and, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { hashPassword } from './encryption-service'
import type { UserCreateRequest, UserResponse, UserUpdateRequest } from '@/types/user'

export const UserService = (d1Database: D1Database, authSecretKey: string) => {
  const db = drizzle(d1Database)

  return {
    getUserById: async (userId: string) => {
      const rows = await db
        .select({
          users: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt,
          },
          sites: {
            id: sites.id,
            cmsUrl: sites.cmsUrl,
            gitRepo: sites.gitRepo,
            gitHost: sites.gitHost,
            gitProvider: sites.gitProvider,
            createdAt: sites.createdAt,
          },
        })
        .from(users)
        .leftJoin(usersToSites, eq(usersToSites.userId, users.id))
        .leftJoin(sites, eq(usersToSites.siteId, sites.id))
        .where(eq(users.id, userId))
        .all()

      const result = rows.reduce<Record<string, UserResponse>>((acc, row) => {
        const user = row.users!
        const site = row.sites
        if (!acc[user.id]) {
          acc[user.id] = { ...user, sites: [] }
        }
        if (site) {
          acc[user.id].sites.push(site)
        }
        return acc
      }, {})

      const firstResult = result[userId]

      if (!firstResult) {
        return undefined
      }

      return firstResult
    },
    getUserByEmailAndSite: async (email: string, siteId: string) => {
      const result = await db
        .select()
        .from(users)
        .leftJoin(usersToSites, eq(usersToSites.userId, users.id))
        .leftJoin(sites, eq(sites.id, usersToSites.siteId))
        .where(and(eq(users.email, email), eq(usersToSites.siteId, siteId)))
        .get()

      if (!result) {
        return undefined
      }

      return {
        user: result.users,
        site: result.sites!,
      }
    },
    getUserByEmail: async (email: string) => {
      const result = await db.select().from(users).where(eq(users.email, email)).get()

      if (!result) {
        return null
      }

      return result
    },
    getAllUser: async () => {
      return await db.select().from(users).all()
    },
    createUser: (userRequest: UserCreateRequest) => {
      const hashedPassword = hashPassword(userRequest.password, authSecretKey)

      return db
        .insert(users)
        .values({
          firstName: userRequest.firstName,
          lastName: userRequest.lastName,
          email: userRequest.email,
          password: hashedPassword,
          role: userRequest.role,
        })
        .returning({
          id: users.id,
        })
        .get()
    },
    updateUser: async (userId: string, userRequest: UserUpdateRequest) => {
      const existingUser = await db.select().from(users).where(eq(users.id, userId)).get()
      if (!existingUser) {
        throw new Error('User not found')
      }

      const firstName = userRequest.firstName || existingUser.firstName
      const lastName = userRequest.lastName || existingUser.lastName
      const role = userRequest.role || existingUser.role

      const result = await db
        .update(users)
        .set({
          firstName,
          lastName,
          role,
        })
        .where(eq(users.id, userId))
      return result.meta.rows_written > 0
    },
    deleteUser: async (userId: string) => {
      const result = await db.delete(users).where(eq(users.id, userId))
      return result.meta.rows_written > 0
    },
    addUserSite: async (userId: string, siteId: string) => {
      const result = await db.insert(usersToSites).values({ siteId: siteId, userId: userId })
      return result.meta.rows_written > 0
    },
  }
}
