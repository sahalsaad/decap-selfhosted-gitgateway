import { faker } from '@faker-js/faker'
import { OpenAPIHono } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'

import type { AppBindings } from '@/types/app-bindings'
import type { JwtVariables } from '@/types/jwt-variables'

import { createInvite, resetPassword } from '@/src/routes/api/admin/account/account.definitions'
import { InviteService } from '@services/invite-service'
import { UserService } from '@services/user-service'

export default new OpenAPIHono<AppBindings<JwtVariables>>()
  .openapi(
    resetPassword,
    async (ctx) => {
      const jsonBody = ctx.req.valid('json')
      const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
      const randomPassword = faker.internet.password()
      const success = await userService.setPassword(jsonBody.email, randomPassword)
      if (!success) {
        return ctx.json(
          {
            message: HttpStatusPhrases.NOT_FOUND,
          },
          HttpStatusCodes.NOT_FOUND,
        )
      }
      return ctx.json({ temporaryPassword: randomPassword }, 200)
    },
  )
  .openapi(createInvite, async (ctx) => {
    const inviteRequest = ctx.req.valid('json')

    const inviteService = InviteService(ctx.env.DB)
    const result = await inviteService.createInvite(inviteRequest)

    const url = new URL(ctx.req.url)

    return ctx.json(
      {
        inviteUrl: `${url.origin}/register?invite=${result.id}`,
      },
      HttpStatusCodes.CREATED,
    )
  })
