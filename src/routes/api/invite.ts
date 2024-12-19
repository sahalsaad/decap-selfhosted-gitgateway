import { zValidator } from '@hono/zod-validator'
import { InviteService } from '@services/invite-service'
import { Hono } from 'hono'
import { createInviteSchema } from '@/types/invite'
import type { Variables } from '@/types/variables'

const inviteRoute = new Hono<{
  Bindings: CloudflareBindings
  Variables: Variables
}>()

inviteRoute.post('/', zValidator('json', createInviteSchema), async (ctx) => {
  const inviteRequest = ctx.req.valid('json')

  const inviteService = InviteService(ctx.env.DB)
  const result = await inviteService.createInvite(inviteRequest)

  return ctx.json(result, 201)
})

export { inviteRoute }
