import type { Context, Next } from 'hono'

import { createMiddleware } from 'hono/factory'
import { jwt } from 'hono/jwt'

import type { BaseAppBindings } from '@/types/app-bindings'

function jwtMiddleware(ctx: Context<BaseAppBindings>, next: Next) {
  const jwtMiddleware = jwt({
    secret: ctx.env.AUTH_SECRET_KEY,
  })
  return jwtMiddleware(ctx, next)
}

const jwtAdminMiddleware = createMiddleware(async (ctx, next) => {
  const jwtPayload = ctx.get('jwtPayload')
  if (jwtPayload.user.role !== 'admin') {
    return ctx.body(null, 401)
  }

  await next()
})

export { jwtAdminMiddleware, jwtMiddleware }
