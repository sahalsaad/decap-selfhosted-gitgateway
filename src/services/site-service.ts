import { and, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'

import type { SiteCreateRequest, SiteUpdateRequest } from '@selfTypes/sites'

import { userListResponseSchema } from '@/types/user'
import { sites } from '@db/sites'
import { sitesUsers } from '@db/sites-users'
import { users } from '@db/users'

import { encrypt } from './encryption-service'

export function SiteService(d1Database: D1Database, authSecretKey: string) {
  const db = drizzle(d1Database)

  return {
    getSiteById: (siteId: string) => {
      return db.select().from(sites).where(eq(sites.id, siteId)).get()
    },
    getAllSite: () => {
      return db.select().from(sites).all()
    },
    createSite: async (siteRequest: SiteCreateRequest) => {
      const encryptedToken = await encrypt(siteRequest.gitToken, authSecretKey)
      return db
        .insert(sites)
        .values({
          cmsUrl: siteRequest.cmsUrl,
          gitRepo: siteRequest.gitRepo,
          gitProvider: siteRequest.gitProvider,
          gitToken: encryptedToken,
          gitHost: siteRequest.gitHost,
        })
        .returning()
        .onConflictDoNothing()
        .get()
    },
    updateSite: async (siteId: string, siteRequest: SiteUpdateRequest) => {
      const existingSite = await db
        .select()
        .from(sites)
        .where(eq(sites.id, siteId))
        .get()
      if (!existingSite) {
        return null
      }

      let updateSite = {}
      if (siteRequest.gitToken) {
        const encryptedToken = await encrypt(
          siteRequest.gitToken,
          authSecretKey,
        )
        updateSite = { gitToken: encryptedToken }
      }

      if (siteRequest.gitRepo) {
        updateSite = { ...updateSite, gitRepo: siteRequest.gitRepo }
      }

      if (siteRequest.gitProvider) {
        updateSite = { ...updateSite, gitProvider: siteRequest.gitProvider }
      }

      if (siteRequest.cmsUrl) {
        updateSite = { ...updateSite, url: siteRequest.cmsUrl }
      }

      if (siteRequest.gitHost) {
        updateSite = { ...updateSite, gitHost: siteRequest.gitHost }
      }

      return db
        .update(sites)
        .set(updateSite)
        .where(eq(sites.id, siteId))
        .returning()
        .get()
    },
    deleteSite: async (siteId: string) => {
      const result = await db.delete(sites).where(eq(sites.id, siteId))
      return result.meta.rows_written === 1
    },
    addUser: async (userId: string, siteId: string) => {
      const result = await db.insert(sitesUsers).values({ siteId, userId }).onConflictDoNothing()
      return result.meta.rows_written > 0
    },
    removeUser: async (userId: string, siteId: string) => {
      const result = await db.delete(sitesUsers).where(and(eq(sitesUsers.userId, userId), eq(sitesUsers.siteId, siteId)))
      return result.meta.rows_written > 0
    },
    getUsers: async (siteId: string) => {
      const result = await db.select().from(sitesUsers).innerJoin(users, eq(users.id, sitesUsers.userId)).where(eq(sitesUsers.siteId, siteId)).all()
      return userListResponseSchema.parse(result.map(row => row.users))
    },
  }
}
