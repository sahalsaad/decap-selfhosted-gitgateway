import type { Context } from 'hono'

import { createRoute, z } from '@hono/zod-openapi'
import { basicAuth } from 'hono/basic-auth'
import { timingSafeEqual } from 'hono/utils/buffer'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent } from 'stoker/openapi/helpers'

import type { AppBindings } from '@/types/app-bindings'

import { hashPassword } from '@services/encryption-service'
import { UserService } from '@services/user-service'

export const JwtResponseSchema = z.object({
  token_type: z.literal('bearer'),
  access_token: z.string(),
  expires_in: z.number().default(60 * 60 * 12 * 1000),
})

export const getToken = createRoute({
  tags: ['Auth'],
  summary: 'Get auth token',
  description: 'Retrieve the auth token',
  method: 'get',
  path: '/',
  middleware: [
    basicAuth({
      verifyUser: async (
        email: string,
        password: string,
        ctx: Context<AppBindings<BasicAuthVariables>>,
      ) => {
        const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
        const user = await userService.getUserByEmail(email)
        if (!user) {
          return false
        }

        const hashedPassword = hashPassword(password, ctx.env.AUTH_SECRET_KEY)
        if (
          (await timingSafeEqual(user.password, hashedPassword))
          && user.role === 'admin'
        ) {
          ctx.set('user', {
            id: user.id,
            email: user.email,
            role: user.role,
          })
          return true
        }

        return false
      },
      invalidUserMessage: 'Invalid username, password or not an admin',
    }),
  ] as const,
  responses: {
    [HttpStatusCodes.UNAUTHORIZED]: {
      content: {
        'text/plain': {
          schema: z
            .string()
            .openapi({ example: 'Invalid username, password or not an admin' }),
        },
      },
      description: 'Invalid username, password or not an admin',
    },
    [HttpStatusCodes.OK]: jsonContent(
      JwtResponseSchema,
      'Retrieve the auth token',
    ),
  },
  security: [{ Basic: [] }],
})
