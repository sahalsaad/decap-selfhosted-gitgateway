import { Hono } from 'hono'

import type { BaseAppBindings } from '@/types/app-bindings'

import { renderer } from '@/src/middlewares/renderer'
import { SetPasswordForm } from '@client/components/set-password-form'

const updatePasswordClient = new Hono<BaseAppBindings>()

updatePasswordClient.use('*', renderer)
updatePasswordClient.get('/', async (ctx) => {
  return ctx.render(<SetPasswordForm />, {
    title: 'Update Password',
  })
})

export { updatePasswordClient }
