import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

import type { BaseAppBindings } from '@/types/app-bindings'

import { ErrorMessage } from '@client/components/error-message'
import { SuccessMessage } from '@client/components/success-message'
import { inviteHandleRequestSchema } from '@selfTypes/invite'
import { InviteService } from '@services/invite-service'
import { SiteService } from '@services/site-service'
import { UserService } from '@services/user-service'

export default new Hono<BaseAppBindings>()
  .post('/', zValidator('json', inviteHandleRequestSchema, (result, ctx) => {
    if (!result.success) {
      const errorMessage = result.error.issues
        .map(issue => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ')
      return ctx.render(<ErrorMessage>{errorMessage}</ErrorMessage>)
    }
  }), async (ctx) => {
    const createUserRequest = ctx.req.valid('json')

    const inviteService = InviteService(ctx.env.DB)
    const invite = await inviteService.getInviteById(createUserRequest.inviteId)

    if (!invite) {
      return ctx.render(<ErrorMessage>Invalid invite id</ErrorMessage>)
    }

    const deleteSuccess = await inviteService.deleteInvite(invite.id)
    if (!deleteSuccess) {
      return ctx.render(<ErrorMessage>Invalid invite id</ErrorMessage>)
    }

    const email = invite.email ? invite.email : createUserRequest.email

    const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
    const createdUser = await userService.createUser({
      email,
      firstName: createUserRequest.firstName,
      lastName: createUserRequest.lastName,
      password: createUserRequest.password,
      role: invite.role,
    })

    const successMessage = [
      <SuccessMessage>Register successful.</SuccessMessage>,
    ]

    if (invite.siteId) {
      const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!)
      await siteService.addUser(createdUser.id, invite.siteId)
      const site = await siteService.getSiteById(invite.siteId)
      successMessage.push(
        <a className="text-blue-500" href={site!.cmsUrl}>
          Go to CMS
        </a>,
      )
    }

    ctx.res.headers.set('HX-Retarget', 'this')
    return ctx.render(<div className="text-center">{successMessage}</div>)
  })
