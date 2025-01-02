import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

import type { BaseAppBindings } from '@/types/app-bindings'

import { setPasswordRequestSchema } from '@/types/password'
import { hashPassword } from '@services/encryption-service'
import { UserService } from '@services/user-service'

export default new Hono<BaseAppBindings>()
  .post(
    '/',
    zValidator('json', setPasswordRequestSchema, (result, ctx) => {
      if (!result.success) {
        const errorMessage = result.error.issues
          .map(issue => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ')
        return ctx.render(<span className="text-red-700">{errorMessage}</span>)
      }
    }),
    async (ctx) => {
      const request = await ctx.req.json()
      const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
      const user = await userService.getUserByEmail(request.email)
      if (!user) {
        return ctx.render(<span className="text-red-700">User not found</span>)
      }

      const existingPassword = request.currentPassword
      const hashedPassword = hashPassword(existingPassword, ctx.env.AUTH_SECRET_KEY!)

      if (user.password !== hashedPassword) {
        return ctx.render(<span className="text-red-700">Incorrect password</span>)
      }

      await userService.setPassword(user.email, request.newPassword)
      ctx.res.headers.set('HX-Retarget', 'this')
      return ctx.render(
        <span className="text-green-700 text-2xl">Password updated successfully!</span>,
      )
    },
  )
