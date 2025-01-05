import { OpenAPIHono } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'

import type { AppBindings } from '@/types/app-bindings'
import type { JwtVariables } from '@/types/jwt-variables'

import { deleteUser, getUser, getUsers, getUserSites, updateUser } from '@/src/routes/api/admin/user/user.definitions'
import { userGetResponseSchema, userListResponseSchema } from '@/types/user'
import { UserService } from '@services/user-service'

export default new OpenAPIHono<AppBindings<JwtVariables>>()
  .openapi(updateUser, async (ctx) => {
    const userRequest = ctx.req.valid('json')
    const { id } = ctx.req.valid('param')

    const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
    const result = await userService.updateUser(id, userRequest)
    if (!result) {
      return ctx.json(
        {
          message: HttpStatusPhrases.NOT_FOUND,
        },
        HttpStatusCodes.NOT_FOUND,
      )
    }

    const cleanResult = userGetResponseSchema.parse(result)

    return ctx.json(cleanResult, HttpStatusCodes.ACCEPTED)
  })
  .openapi(deleteUser, async (ctx) => {
    const { id } = ctx.req.valid('param')
    const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
    const isSuccess = await userService.deleteUser(id)

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
  .openapi(getUser, async (ctx) => {
    const { id } = ctx.req.valid('param')
    const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
    const user = await userService.getUserById(id)

    if (!user) {
      return ctx.json(
        {
          message: HttpStatusPhrases.NOT_FOUND,
        },
        HttpStatusCodes.NOT_FOUND,
      )
    }

    const cleanResult = userGetResponseSchema.parse(user)
    return ctx.json(cleanResult, HttpStatusCodes.OK)
  })

  .openapi(getUsers, async (ctx) => {
    const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
    const userList = await userService.getAllUser()
    const cleanResult = userListResponseSchema.parse(userList)
    return ctx.json(cleanResult, HttpStatusCodes.OK)
  })
  .openapi(getUserSites, async (ctx) => {
    const { id } = ctx.req.valid('param')

    const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
    const user = await userService.getUserById(id)

    if (!user) {
      return ctx.json(
        {
          message: HttpStatusPhrases.NOT_FOUND,
        },
        HttpStatusCodes.NOT_FOUND,
      )
    }

    const userSites = await userService.getUserSites(id)
    return ctx.json(userSites, HttpStatusCodes.OK)
  })
