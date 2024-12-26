import { zValidator } from '@hono/zod-validator'
import { jwtAdminMiddleware, jwtMiddleware } from '@server/middlewares/jwt'
import { UserService } from '@services/user-service'
import { Hono } from 'hono'
import { userUpdateRequestSchema } from '@/types/user'

const usersRoute = new Hono<{ Bindings: CloudflareBindings }>()

usersRoute.use('/*', jwtMiddleware, jwtAdminMiddleware)
usersRoute.put('/:userId', zValidator('json', userUpdateRequestSchema), async (ctx) => {
  const userRequest = ctx.req.valid('json')
  const userId = ctx.req.param('userId')

  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
  const isSuccess = await userService.updateUser(userId, userRequest)
  if (!isSuccess) {
    return ctx.notFound()
  }

  return ctx.body(null, 204)
})

usersRoute.delete('/:userId', async (ctx) => {
  const userId = ctx.req.param('userId')
  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
  const isSuccess = await userService.deleteUser(userId)

  if (isSuccess) {
    return ctx.body(null, 204)
  }

  return ctx.notFound()
})

usersRoute.get('/:userId', async (ctx) => {
  const userId = ctx.req.param('userId')
  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
  const user = await userService.getUserById(userId)

  if (!user) {
    return ctx.notFound()
  }

  return ctx.json(user)
})

usersRoute.get('/', async (ctx) => {
  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
  const userList = await userService.getAllUser()
  return ctx.json(userList)
})

export { usersRoute }
