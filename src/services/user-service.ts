import { and, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'

import type { UserCreateRequest, UserUpdateRequest } from '@/types/user'

import { siteListResponseSchema } from '@/types/sites'
import { sites } from '@db/sites'
import { sitesUsers } from '@db/sites-users'
import { users } from '@db/users'

import { hashPassword } from './encryption-service'

export function UserService(d1Database: D1Database, authSecretKey: string) {
  const db = drizzle(d1Database)

  return {
    getUserById: async (userId: string) => {
      return db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .get()
    },
    getUserByEmailAndSite: async (email: string, siteId: string) => {
      const result = await db
        .select()
        .from(users)
        .leftJoin(sitesUsers, eq(sitesUsers.userId, users.id))
        .leftJoin(sites, eq(sites.id, sitesUsers.siteId))
        .where(and(eq(users.email, email), eq(sitesUsers.siteId, siteId)))
        .get()

      if (!result) {
        return undefined
      }

      return {
        ...result.users,
        sites: [result.sites!],
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
        return null
      }

      const firstName = userRequest.firstName || existingUser.firstName
      const lastName = userRequest.lastName || existingUser.lastName
      const role = userRequest.role || existingUser.role

      return db
        .update(users)
        .set({
          firstName,
          lastName,
          role,
        })
        .where(eq(users.id, userId))
        .returning()
        .get()
    },
    deleteUser: async (userId: string) => {
      const result = await db.delete(users).where(eq(users.id, userId))
      return result.meta.rows_written > 0
    },
    setPassword: async (email: string, password: string) => {
      const hashedPassword = hashPassword(password, authSecretKey)
      const result = await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.email, email))
      return result.meta.rows_written > 0
    },
    getUserSites: async (userId: string) => {
      const result = await db.select().from(sitesUsers).innerJoin(sites, eq(sites.id, sitesUsers.siteId)).where(eq(sitesUsers.userId, userId)).all()
      return siteListResponseSchema.parse(result.map(row => row.sites))
    },
  }
}
