import { Hono } from 'hono'

import type { BaseAppBindings } from '@/types/app-bindings'

import { jwtMiddleware } from '@server/middlewares/jwt'
import { decrypt } from '@services/encryption-service'

const githubRoute = new Hono<BaseAppBindings>()

githubRoute.use('/:path{.+}', jwtMiddleware)
githubRoute.all('/:path{.+}', async (ctx) => {
  const jwtPayload = ctx.get('jwtPayload')

  const gitToken = decrypt(jwtPayload.git.token, ctx.env.AUTH_SECRET_KEY)
  const req = new Request(ctx.req.raw)
  req.headers.set('authorization', `Bearer ${gitToken}`)
  ctx.req.raw = req

  return await fetch(
    `https://api.${jwtPayload.git.host ?? 'github.com'}/repos/${jwtPayload.git.repo}/${ctx.req.param('path')}`,
    {
      method: ctx.req.method,
      headers: ctx.req.raw.headers,
      body: ctx.req.raw.body,
    },
  )
})

export { githubRoute }
