import { GeneralMessage } from '@client/components/GeneralMessage'
import { RegisterForm } from '@client/components/registerForm'
import { renderer } from '@server/middlewares/renderer'
import { InviteService } from '@services/invite-service'
import { Hono } from 'hono'

const registerClient = new Hono<{ Bindings: CloudflareBindings }>()

registerClient.use('*', renderer)
registerClient.get('/', async (ctx) => {
  const siteData = {
    title: 'Register',
    description: 'Register for a new account',
  }
  const inviteId = ctx.req.query('invite')
  if (!inviteId) {
    return ctx.render(
      <GeneralMessage
        title='Invalid invite'
        message='Please contact the admin to get a new invite.'
        siteData={siteData}
      />
    )
  }

  const inviteService = InviteService(ctx.env.DB)
  const invite = await inviteService.getInviteById(inviteId)
  if (!invite) {
    return ctx.render(
      <GeneralMessage
        title='Invalid invite'
        message='Please contact the admin to get a new invite.'
        siteData={siteData}
      />
    )
  }

  const props = {
    email: invite.email,
    enableEmail: !invite.email,
    inviteId,
    siteData,
  }
  return ctx.render(<RegisterForm {...props} />)
})

export { registerClient }
