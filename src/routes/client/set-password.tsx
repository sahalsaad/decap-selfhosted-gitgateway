import { SetPasswordForm } from '@client/components/set-password-form'
import { Hono } from 'hono'
import { renderer } from '@/src/middlewares/renderer'
import type { BaseAppBindings } from '@/types/app-bindings'

const updatePasswordClient = new Hono<BaseAppBindings>()

updatePasswordClient.use('*', renderer)
updatePasswordClient.get('/', async (ctx) => {
  return ctx.render(<SetPasswordForm />, {
    title: 'Update Password',
  })
})

export { updatePasswordClient }
