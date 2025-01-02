import { OpenAPIHono } from '@hono/zod-openapi'
import { sign } from 'hono/jwt'
import * as HttpStatusCodes from 'stoker/http-status-codes'

import type { AppBindings } from '@/types/app-bindings'

import { getToken } from '@/src/routes/api/admin/auth/auth.definitions'

export default new OpenAPIHono<AppBindings<BasicAuthVariables>>().openapi(
  getToken,
  async (ctx) => {
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

    return ctx.json(jwt, HttpStatusCodes.OK)
  },
)
