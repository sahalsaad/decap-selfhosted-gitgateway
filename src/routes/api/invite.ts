import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

import type { JwtVariables } from '@/types/jwt-variables'

import { jwtAdminMiddleware, jwtMiddleware } from '@/src/middlewares/jwt'
import { inviteCreateRequestSchema } from '@/types/invite'
import { InviteService } from '@services/invite-service'

const inviteRoute = new Hono<{
  Bindings: CloudflareBindings
  Variables: JwtVariables
}>()

inviteRoute.use('/*', jwtMiddleware, jwtAdminMiddleware)
inviteRoute.post('/', zValidator('json', inviteCreateRequestSchema), async (ctx) => {
  const inviteRequest = ctx.req.valid('json')

  const inviteService = InviteService(ctx.env.DB)
  const result = await inviteService.createInvite(inviteRequest)

  const url = new URL(ctx.req.url)

  return ctx.json(
    {
      inviteUrl: `${url.origin}/register?invite=${result.id}`,
    },
    201,
  )
})

export { inviteRoute }
