import { faker } from '@faker-js/faker'
import { InviteService } from '@services/invite-service'
import { env } from 'cloudflare:test'

describe('invite service', () => {
  describe('createInvite', () => {
    it('should be able to create invite with email', async () => {
      const inviteService = InviteService(env.DB)
      const invite = await inviteService.createInvite({
        email: faker.internet.email(),
        role: faker.helpers.arrayElement(['admin', 'contributor']),
      })
      expect(invite).toBeDefined()
      expect(invite.id).toBeDefined()
    })

    it('should be able to create invite with siteId', async () => {
      const inviteService = InviteService(env.DB)
      const invite = await inviteService.createInvite({
        siteId: faker.string.uuid(),
        role: faker.helpers.arrayElement(['admin', 'contributor']),
      })
      expect(invite).toBeDefined()
      expect(invite.id).toBeDefined()
    })

    it('should be able to create invite without email and siteId', async () => {
      const inviteService = InviteService(env.DB)
      const invite = await inviteService.createInvite({
        role: faker.helpers.arrayElement(['admin', 'contributor']),
      })
      expect(invite).toBeDefined()
      expect(invite.id).toBeDefined()
    })

    it('should be able to create invite with email and siteId', async () => {
      const inviteService = InviteService(env.DB)
      const invite = await inviteService.createInvite({
        email: faker.internet.email(),
        siteId: faker.string.uuid(),
        role: faker.helpers.arrayElement(['admin', 'contributor']),
      })
      expect(invite).toBeDefined()
      expect(invite.id).toBeDefined()
    })

    it('should return existing invite if already exists', async () => {
      const inviteService = InviteService(env.DB)
      const email = faker.internet.email()
      const siteId = faker.string.uuid()
      const invite = await inviteService.createInvite({
        email,
        siteId,
      })
      const recreateInvite = await inviteService.createInvite({ email, siteId })

      expect(recreateInvite.id).toBe(invite.id)
    })

    it('should update siteId if it differs', async () => {
      const inviteService = InviteService(env.DB)
      const email = faker.internet.email()
      const firstSiteId = faker.string.uuid()
      const secondSiteId = faker.string.uuid()
      const firstInvite = await inviteService.createInvite({
        email,
        siteId: firstSiteId,
      })
      const recreateInvite = await inviteService.createInvite({ email, siteId: secondSiteId })

      const invite = await inviteService.getInviteById(recreateInvite.id)
      expect(invite?.id).toBe(firstInvite.id)
      expect(invite?.siteId).toBe(secondSiteId)
    })
  })

  describe('getInviteById', () => {
    it('should return undefined if invite does not exist', async () => {
      const inviteService = InviteService(env.DB)
      const invite = await inviteService.getInviteById(faker.string.uuid())
      expect(invite).toBeUndefined()
    })

    it('should return invite if it exists', async () => {
      const inviteService = InviteService(env.DB)
      const email = faker.internet.email()
      const siteId = faker.string.uuid()
      const invite = await inviteService.createInvite({
        email,
        siteId,
      })
      const result = await inviteService.getInviteById(invite.id)
      expect(result?.id).toBe(invite.id)
    })
  })

  describe('deleteInvite', () => {
    it('should return false if invite does not exist', async () => {
      const inviteService = InviteService(env.DB)
      const result = await inviteService.deleteInvite(faker.string.uuid())
      expect(result).toBe(false)
    })

    it('should return true if invite exists', async () => {
      const inviteService = InviteService(env.DB)
      const email = faker.internet.email()
      const siteId = faker.string.uuid()
      const invite = await inviteService.createInvite({
        email,
        siteId,
      })
      const result = await inviteService.deleteInvite(invite.id)
      expect(result).toBe(true)
    })
  })
})
