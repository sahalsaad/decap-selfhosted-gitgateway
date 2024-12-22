import { zValidator } from '@hono/zod-validator'
import { InviteService } from '@services/invite-service'
import { Hono } from 'hono'
import { jwtMiddleware } from '@/src/middlewares/jwt'
import { inviteCreateRequestSchema } from '@/types/invite'
import type { Variables } from '@/types/variables'

const inviteRoute = new Hono<{
  Bindings: CloudflareBindings
  Variables: Variables
}>()

inviteRoute.use('/*', jwtMiddleware)
inviteRoute.post('/', zValidator('json', inviteCreateRequestSchema), async (ctx) => {
  const inviteRequest = ctx.req.valid('json')

  const inviteService = InviteService(ctx.env.DB)
  const result = await inviteService.createInvite(inviteRequest)

  const url = new URL(ctx.req.url)

  return ctx.json(
    {
      inviteUrl: url.origin + '/register?invite=' + result.id,
    },
    201
  )
})

export { inviteRoute }
