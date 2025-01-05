import { faker } from '@faker-js/faker'
import { env } from 'cloudflare:test'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { seed } from 'drizzle-seed'

import { generateSiteRequest } from '@/vitest/data-helpers'
import { sites } from '@db/sites'

import { SiteService } from './site-service'
import '@hono/zod-openapi'

describe('site service', () => {
  describe('getSiteById', () => {
    it('should return undefined if site does not exist', async () => {
      const siteService = SiteService(env.DB, env.AUTH_SECRET_KEY!)
      const site = await siteService.getSiteById(faker.string.uuid())
      expect(site).toBeUndefined()
    })

    it('should return site if it exists', async () => {
      const siteService = SiteService(env.DB, env.AUTH_SECRET_KEY!)
      const createSiteRequest = generateSiteRequest()
      const createdSite = await siteService.createSite(createSiteRequest)
      const site = await siteService.getSiteById(createdSite.id)
      expect(site).toBeDefined()
      expect(site!.id).toBe(createdSite.id)
      expect(site!.cmsUrl).toBe(createSiteRequest.cmsUrl)
      expect(site!.gitRepo).toBe(createSiteRequest.gitRepo)
      expect(site!.gitProvider).toBe(createSiteRequest.gitProvider)
      expect(site!.gitHost).toBe(createSiteRequest.gitHost)
    })
  })

  describe('getAllSite', () => {
    it('should return empty array if no site exists', async () => {
      const siteService = SiteService(env.DB, env.AUTH_SECRET_KEY!)
      const site = await siteService.getAllSite()
      expect(site).toEqual([])
    })

    it('should return all sites', async () => {
      const siteService = SiteService(env.DB, env.AUTH_SECRET_KEY!)
      await seed(drizzle(env.DB), { sites }, { count: 5 })
      const site = await siteService.getAllSite()
      expect(site).toHaveLength(5)
    })
  })

  describe('createSite', () => {
    it('should return undefined if site already exists', async () => {
      const siteService = SiteService(env.DB, env.AUTH_SECRET_KEY!)
      const createSiteRequest = generateSiteRequest()
      await siteService.createSite(createSiteRequest)
      const result = await siteService.createSite(createSiteRequest)
      expect(result).toBeUndefined()
    })

    it('should return success if site does not exist', async () => {
      const siteService = SiteService(env.DB, env.AUTH_SECRET_KEY!)
      const result = await siteService.createSite(generateSiteRequest())
      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
    })

    it('should encrypt gitToken', async () => {
      const siteService = SiteService(env.DB, env.AUTH_SECRET_KEY!)
      const createSiteRequest = generateSiteRequest()
      const site = await siteService.createSite(createSiteRequest)

      const db = drizzle(env.DB)
      const siteFromDB = await db.select().from(sites).where(eq(sites.id, site.id)).get()
      expect(siteFromDB?.gitToken).not.toBe(createSiteRequest.gitToken)
    })
  })

  describe('updateSite', () => {
    it('should return null if site does not exist', async () => {
      const siteService = SiteService(env.DB, env.AUTH_SECRET_KEY!)
      const result = await siteService.updateSite(faker.string.uuid(), {})
      expect(result).toBeNull()
    })

    it('should return updated site if site exists', async () => {
      const siteService = SiteService(env.DB, env.AUTH_SECRET_KEY!)
      const site = await siteService.createSite(generateSiteRequest())

      const updateSiteRequest = {
        gitRepo: faker.internet.url(),
        gitProvider: faker.helpers.arrayElement(['github', 'gitlab', 'bitbucket']),
        gitHost: faker.internet.url(),
      }
      const result = await siteService.updateSite(site.id, updateSiteRequest)
      expect(result?.gitRepo).toBe(updateSiteRequest.gitRepo)
      expect(result?.gitProvider).toBe(updateSiteRequest.gitProvider)
      expect(result?.gitHost).toBe(updateSiteRequest.gitHost)
    })

    it('should encrypt gitToken', async () => {
      const siteService = SiteService(env.DB, env.AUTH_SECRET_KEY!)
      const site = await siteService.createSite(generateSiteRequest())
      const gitToken = faker.string.uuid()
      await siteService.updateSite(site.id, { gitToken })

      const db = drizzle(env.DB)
      const siteFromDB = await db.select().from(sites).where(eq(sites.id, site.id)).get()
      expect(siteFromDB?.gitToken).not.toBe(gitToken)
    })
  })

  describe('deleteSite', () => {
    it('should return false if site does not exist', async () => {
      const siteService = SiteService(env.DB, env.AUTH_SECRET_KEY!)
      const result = await siteService.deleteSite(faker.string.uuid())
      expect(result).toBe(false)
    })

    it('should return true if site exists', async () => {
      const siteService = SiteService(env.DB, env.AUTH_SECRET_KEY!)
      const site = await siteService.createSite(generateSiteRequest())
      const result = await siteService.deleteSite(site.id)
      expect(result).toBe(true)
    })
  })
})
