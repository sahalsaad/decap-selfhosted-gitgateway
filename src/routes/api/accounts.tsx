import { faker } from '@faker-js/faker'
import { zValidator } from '@hono/zod-validator'
import { hashPassword } from '@services/encryption-service'
import { UserService } from '@services/user-service'
import { Hono } from 'hono'
import { jwtAdminMiddleware, jwtMiddleware } from '@/src/middlewares/jwt'
import { resetPasswordRequestSchema, setPasswordRequestSchema } from '@/types/password'
import type { Variables } from '@/types/variables'

const accountsRoute = new Hono<{
  Bindings: CloudflareBindings
  Variables: Variables
}>()

accountsRoute.post(
  '/reset-password',
  jwtMiddleware,
  jwtAdminMiddleware,
  zValidator('json', resetPasswordRequestSchema),
  async (ctx) => {
    const jsonBody = ctx.req.valid('json')
    const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
    const randomPassword = faker.internet.password()
    const success = await userService.setPassword(jsonBody.email, randomPassword)
    if (!success) {
      return ctx.json(null, 400)
    }
    return ctx.json({ temporaryPassword: randomPassword })
  }
)

accountsRoute.post(
  '/set-password',
  zValidator('json', setPasswordRequestSchema, (result, c) => {
    if (!result.success) {
      const errorMessage = result.error.issues.map((issue) => issue.message).join(', ')
      return c.render(<span className='text-red-700'>{errorMessage}</span>)
    }
  }),
  async (ctx) => {
    const request = await ctx.req.json()
    const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
    const user = await userService.getUserByEmail(request.email)
    if (!user) {
      return ctx.render(<span className='text-red-700'>User not found</span>)
    }

    const existingPassword = request.currentPassword
    const hashedPassword = hashPassword(existingPassword, ctx.env.AUTH_SECRET_KEY!)

    if (user.password !== hashedPassword) {
      return ctx.render(<span className='text-red-700'>Incorrect password</span>)
    }

    await userService.setPassword(user.email, request.newPassword)
    ctx.res.headers.set('HX-Retarget', 'this')
    return ctx.render(
      <span className='text-green-700 text-2xl'>Password updated successfully!</span>
    )
  }
)

export { accountsRoute }
