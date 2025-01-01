import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { basicAuth } from 'hono/basic-auth'
import { sign } from 'hono/jwt'
import { timingSafeEqual } from 'hono/utils/buffer'

import type { AppBindings } from '@/types/app-bindings'

import { hashPassword } from '@services/encryption-service'
import { UserService } from '@services/user-service'

const adminAuthRoute = new OpenAPIHono<AppBindings<BasicAuthVariables>>()

adminAuthRoute.use(
  '/',
  basicAuth({
    verifyUser: async (email: string, password: string, ctx) => {
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
    invalidUserMessage: 'Invalid username or password or not admin',
  }),
)

const JwtResponseSchema = z.object({
  token_type: z.literal('bearer'),
  access_token: z.string(),
  expires_in: z.number(),
})

type JwtResponse = z.infer<typeof JwtResponseSchema>

const authRoute = createRoute({
  tags: ['Auth'],
  method: 'get',
  path: '/',
  responses: {
    401: {
      description: 'Invalid credentials',
    },
    200: {
      content: {
        'application/json': {
          schema: JwtResponseSchema,
        },
      },
      description: 'Retrieve the auth token',
    },
  },
  security: [{ basicAuth: [] }],
})

adminAuthRoute.openapi(authRoute, async (ctx) => {
  const duration = 60 * 60 * 12
  const user = ctx.get('user')
  const jwtPayload = {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    exp: Math.floor(Date.now() / 1000) + duration,
  }
  const accessToken = await sign(jwtPayload, ctx.env.AUTH_SECRET_KEY!)
  const jwt: JwtResponse = {
    token_type: 'bearer',
    access_token: accessToken,
    expires_in: duration * 1000,
  }

  return ctx.json(jwt, 200)
})

export { adminAuthRoute }
