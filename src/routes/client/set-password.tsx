import { SetPasswordForm } from '@client/components/set-password-form'
import { Hono } from 'hono'
import { renderer } from '@/src/middlewares/renderer'

const updatePasswordClient = new Hono<{ Bindings: CloudflareBindings }>()

updatePasswordClient.use('*', renderer)
updatePasswordClient.get('/', async (ctx) => {
  return ctx.render(<SetPasswordForm />, {
    title: 'Update Password',
  })
})

export { updatePasswordClient }
