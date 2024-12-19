import { sites } from '@db/sites'
import type { SiteCreateRequest, SiteUpdateRequest } from '@selfTypes/sites'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { encrypt } from './encryption-service'

export const SiteService = (d1Database: D1Database, authSecretKey: string) => {
  const db = drizzle(d1Database)

  return {
    getSiteById: (siteId: string) => {
      return db
        .select({
          id: sites.id,
          url: sites.url,
          gitRepo: sites.gitRepo,
          gitHost: sites.gitHost,
        })
        .from(sites)
        .where(eq(sites.id, siteId))
        .get()
    },
    getAllSite: () => {
      return db
        .select({
          id: sites.id,
          url: sites.url,
          gitRepo: sites.gitRepo,
          gitHost: sites.gitHost,
        })
        .from(sites)
        .all()
    },
    createSite: async (siteRequest: SiteCreateRequest) => {
      const encryptedToken = await encrypt(siteRequest.gitToken, authSecretKey)
      return db
        .insert(sites)
        .values({
          url: siteRequest.url,
          gitRepo: siteRequest.gitRepo,
          gitProvider: siteRequest.gitProvider,
          gitToken: encryptedToken,
          gitHost: siteRequest.gitHost,
        })
        .returning({
          id: sites.id,
        })
        .get()
    },
    updateSite: async (siteId: string, siteRequest: SiteUpdateRequest) => {
      const existingSite = await db.select().from(sites).where(eq(sites.id, siteId)).get()
      if (!existingSite) {
        throw new Error('Site not found')
      }

      let updateSite = {}
      if (siteRequest.gitToken) {
        const encryptedToken = encrypt(siteRequest.gitToken, authSecretKey)
        updateSite = { gitToken: encryptedToken }
      }

      if (siteRequest.gitRepo) {
        updateSite = { ...updateSite, gitRepo: siteRequest.gitRepo }
      }

      if (siteRequest.gitProvider) {
        updateSite = { ...updateSite, gitProvider: siteRequest.gitProvider }
      }

      if (siteRequest.url) {
        updateSite = { ...updateSite, url: siteRequest.url }
      }

      if (siteRequest.gitHost) {
        updateSite = { ...updateSite, gitHost: siteRequest.gitHost }
      }

      const result = await db.update(sites).set(updateSite).where(eq(sites.id, siteId))
      return result.success
    },
    deleteSite: async (siteId: string) => {
      const result = await db.delete(sites).where(eq(sites.id, siteId))
      return result.success
    },
  }
}
