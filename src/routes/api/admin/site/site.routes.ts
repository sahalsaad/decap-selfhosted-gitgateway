import { OpenAPIHono, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'

import type { AppBindings } from '@/types/app-bindings'
import type { JwtVariables } from '@/types/jwt-variables'

import {
  createSite,
  deleteSite,
  getSite,
  getSites,
  updateSite,
} from '@/src/routes/api/admin/site/site.definitions'
import { siteGetResponseSchema } from '@/types/sites'
import { SiteService } from '@services/site-service'
import { UserService } from '@services/user-service'

export default new OpenAPIHono<AppBindings<JwtVariables>>()
  .openapi(createSite, async (ctx) => {
    const { user } = ctx.get('jwtPayload')
    const siteCreateRequest = ctx.req.valid('json')
    const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
    const createdSite = await siteService.createSite(siteCreateRequest)
    const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
    await userService.addUserSite(user.id, createdSite.id)

    return ctx.json(createdSite, HttpStatusCodes.CREATED)
  })
  .openapi(getSite, async (ctx) => {
    const { id } = ctx.req.valid('param')
    const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
    const result = await siteService.getSiteById(id)

    if (!result) {
      return ctx.json(
        {
          message: HttpStatusPhrases.NOT_FOUND,
        },
        HttpStatusCodes.NOT_FOUND,
      )
    }

    const cleanResult = siteGetResponseSchema.parse(result)
    return ctx.json(cleanResult, HttpStatusCodes.OK)
  })
  .openapi(updateSite, async (ctx) => {
    const siteUpdateRequest = ctx.req.valid('json')
    const { id } = ctx.req.valid('param')

    const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
    const isSuccess = await siteService.updateSite(id, siteUpdateRequest)

    if (!isSuccess) {
      return ctx.json(
        {
          message: HttpStatusPhrases.NOT_FOUND,
        },
        HttpStatusCodes.NOT_FOUND,
      )
    }

    return ctx.body(null, HttpStatusCodes.NO_CONTENT)
  })
  .openapi(deleteSite, async (ctx) => {
    const { id } = ctx.req.valid('param')
    const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
    const isSuccess = await siteService.deleteSite(id)

    if (!isSuccess) {
      return ctx.json(
        {
          message: HttpStatusPhrases.NOT_FOUND,
        },
        HttpStatusCodes.NOT_FOUND,
      )
    }

    return ctx.body(null, 204)
  })
  .openapi(getSites, async (ctx) => {
    const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
    const result = await siteService.getAllSite()
    const cleanResult = z.array(siteGetResponseSchema).parse(result)
    return ctx.json(cleanResult, HttpStatusCodes.OK)
  })
