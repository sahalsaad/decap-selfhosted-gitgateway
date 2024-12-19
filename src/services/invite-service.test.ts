import { faker } from '@faker-js/faker'
import { InviteService } from '@services/invite-service'
import { env } from 'cloudflare:test'
import { describe, expect, it } from 'vitest'

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

    it('should throw error if duplicate invite', async () => {
      const inviteService = InviteService(env.DB)
      const email = faker.internet.email()
      const siteId = faker.string.uuid()
      await inviteService.createInvite({
        email: email,
        siteId: siteId,
      })
      await expect(() => inviteService.createInvite({ email, siteId })).rejects.toThrowError()
    })
  })
})
