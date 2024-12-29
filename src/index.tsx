import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { apiRoute } from './routes/api'
import { registerClient } from './routes/client/register'
import { gitGatewayAuthRoute } from './routes/gitgateway/auth'
import { githubRoute } from './routes/gitgateway/github'
import { settingsRoute } from './routes/gitgateway/settings'
import { updatePasswordClient } from '@/src/routes/client/set-password'

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.get('/', (c) => {
  return c.text('Hello!')
})

app.use('*', cors())
app.use('*', logger())

// git gateway endpoints
app.route('/:siteId/auth', gitGatewayAuthRoute)
app.route('/:siteId/settings', settingsRoute)
app.route('/:siteId/github', githubRoute)

// client routes
app.route('/register', registerClient)
app.route('/update-password', updatePasswordClient)

// api endpoints
app.route('/api', apiRoute)

export default app
