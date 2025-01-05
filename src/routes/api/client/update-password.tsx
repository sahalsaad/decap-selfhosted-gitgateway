import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

import type { BaseAppBindings } from '@/types/app-bindings'

import { setPasswordRequestSchema } from '@/types/account'
import { ErrorMessage } from '@client/components/error-message'
import { SuccessMessage } from '@client/components/success-message'
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
        return ctx.render(<ErrorMessage>{errorMessage}</ErrorMessage>)
      }
    }),
    async (ctx) => {
      const request = await ctx.req.json()
      const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
      const user = await userService.getUserByEmail(request.email)
      if (!user) {
        return ctx.render(<ErrorMessage>User not found</ErrorMessage>)
      }

      const existingPassword = request.currentPassword
      const hashedPassword = hashPassword(existingPassword, ctx.env.AUTH_SECRET_KEY!)

      if (user.password !== hashedPassword) {
        return ctx.render(<ErrorMessage>Incorrect password</ErrorMessage>)
      }

      await userService.setPassword(user.email, request.newPassword)
      ctx.res.headers.set('HX-Retarget', 'this')
      return ctx.render(
        <SuccessMessage>Password updated successfully!</SuccessMessage>,
      )
    },
  )
