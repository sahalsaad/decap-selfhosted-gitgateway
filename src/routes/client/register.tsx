import { Hono } from 'hono'

import type { BaseAppBindings } from '@/types/app-bindings'

import { GeneralMessage } from '@client/components/general-message'
import { RegisterForm } from '@client/components/register-form'
import { renderer } from '@server/middlewares/renderer'
import { InviteService } from '@services/invite-service'

export default new Hono<BaseAppBindings>()
  .use('*', renderer)
  .get('/', async (ctx) => {
    const pageTitle = 'Register'
    const inviteId = ctx.req.query('invite')
    let invite
    const isValidInvite = async (id: string) => {
      const inviteService = InviteService(ctx.env.DB)
      invite = await inviteService.getInviteById(id)
      return !!invite
    }

    if (!inviteId || !(await isValidInvite(inviteId))) {
      return ctx.render(
        <GeneralMessage
          title="Invalid invite"
          message="Please contact the admin to get a new invite."
        />,
        {
          title: `${pageTitle} - Invalid invite`,
        },
      )
    }

    const props = {
      email: invite!.email,
      enableEmail: !invite!.email,
      inviteId,
    }
    return ctx.render(<RegisterForm {...props} />, {
      title: pageTitle,
    })
  })
