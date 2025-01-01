import { OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { notFound } from 'stoker/middlewares'

import type { BaseAppBindings } from '@/types/app-bindings'

import { updatePasswordClient } from '@/src/routes/client/set-password'

import { apiRoute } from './routes/api'
import { registerClient } from './routes/client/register'
import { gitGatewayAuthRoute } from './routes/gitgateway/auth'
import { githubRoute } from './routes/gitgateway/github'
import { settingsRoute } from './routes/gitgateway/settings'

const app = new OpenAPIHono<BaseAppBindings>()

app.use('*', cors())
app.use('*', logger())
app.notFound(notFound)

// git gateway endpoints
app.route('/:siteId/auth', gitGatewayAuthRoute)
app.route('/:siteId/settings', settingsRoute)
app.route('/:siteId/github', githubRoute)

// client routes
app.route('/register', registerClient)
app.route('/update-password', updatePasswordClient)

// api endpoints
app.route('/api', apiRoute)

// configure OpenAPI
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Decap Self Hosted Git Gateway',
  },
})

app.openAPIRegistry.registerComponent('securitySchemes', 'Basic', {
  type: 'http',
  scheme: 'Basic',
})

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'Bearer',
})

app.get(
  '/reference',
  apiReference({
    spec: {
      url: '/doc',
    },
  }),
)

export default app
