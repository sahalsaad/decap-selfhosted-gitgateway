import type { Context, Next } from 'hono'
import { createMiddleware } from 'hono/factory'
import { jwt } from 'hono/jwt'

const jwtMiddleware = (ctx: Context<{ Bindings: CloudflareBindings }>, next: Next) => {
  const jwtMiddleware = jwt({
    secret: ctx.env.AUTH_SECRET_KEY,
  })
  return jwtMiddleware(ctx, next)
}

const jwtAdminMiddleware = createMiddleware(
  async (ctx: Context<{ Bindings: CloudflareBindings }>, next: Next) => {
    const jwtPayload = ctx.get('jwtPayload')
    if (jwtPayload.user.role !== 'admin') {
      return ctx.body(null, 401)
    }

    await next()
  }
)

export { jwtMiddleware, jwtAdminMiddleware }
