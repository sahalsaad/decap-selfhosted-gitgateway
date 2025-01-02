import { Hono } from 'hono'

import type { BaseAppBindings } from '@/types/app-bindings'

import { renderer } from '@/src/middlewares/renderer'
import { UpdatePasswordForm } from '@client/components/update-password-form'

export default new Hono<BaseAppBindings>()
  .use('*', renderer)
  .get('/', async (ctx) => {
    return ctx.render(<UpdatePasswordForm />, {
      title: 'Update Password',
    })
  })
