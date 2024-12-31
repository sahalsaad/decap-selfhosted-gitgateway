import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

import type { AppBindings } from '@/types/app-bindings'
import type { JwtVariables } from '@/types/jwt-variables'

import { siteCreateRequestSchema, siteUpdateRequestSchema } from '@selfTypes/sites'
import { jwtAdminMiddleware, jwtMiddleware } from '@server/middlewares/jwt'
import { SiteService } from '@services/site-service'
import { UserService } from '@services/user-service'

const sitesRoute = new Hono<AppBindings<JwtVariables>>()

sitesRoute.use('/*', jwtMiddleware, jwtAdminMiddleware)
sitesRoute.post('/', zValidator('json', siteCreateRequestSchema), async (ctx) => {
  const { user } = ctx.get('jwtPayload')

  const siteCreateRequest = ctx.req.valid('json')
  const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
  const createdSite = await siteService.createSite(siteCreateRequest)
  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
  await userService.addUserSite(user.id, createdSite.id)

  return ctx.json(createdSite, 201)
})

sitesRoute.put('/:siteId', zValidator('json', siteUpdateRequestSchema), async (ctx) => {
  const siteUpdateRequest = ctx.req.valid('json')
  const siteId = ctx.req.param('siteId')

  const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
  const isSuccess = await siteService.updateSite(siteId, siteUpdateRequest)

  if (!isSuccess) {
    return ctx.notFound()
  }

  return ctx.body(null, 204)
})

sitesRoute.delete('/:siteId', async (ctx) => {
  const siteId = ctx.req.param('siteId')
  const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
  const isSuccess = await siteService.deleteSite(siteId)

  if (isSuccess) {
    return ctx.body(null, 204)
  }

  return ctx.notFound()
})

sitesRoute.get('/:siteId', async (ctx) => {
  const siteId = ctx.req.param('siteId')
  const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
  const result = await siteService.getSiteById(siteId)

  if (!result) {
    return ctx.notFound()
  }

  return ctx.json(result)
})

sitesRoute.get('/', async (ctx) => {
  const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
  const result = await siteService.getAllSite()
  return ctx.json(result)
})

export { sitesRoute }
