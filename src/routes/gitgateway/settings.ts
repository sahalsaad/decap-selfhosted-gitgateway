import { jwtMiddleware } from '@server/middlewares/jwt'
import { Hono } from 'hono'
import type { BaseAppBindings } from '@/types/app-bindings'

const settingsRoute = new Hono<BaseAppBindings>()

settingsRoute.use('/', jwtMiddleware)
settingsRoute.get('/', async (ctx) => {
  const { git } = ctx.get('jwtPayload')
  const settings = {
    github_enabled: git.provider === 'github',
    gitlab_enabled: git.provider === 'gitlab',
    bitbucket_enabled: git.provider === 'bitbucket',
    roles: null,
  }

  return ctx.json(settings)
})

export { settingsRoute }
