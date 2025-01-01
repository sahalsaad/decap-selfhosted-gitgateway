import { OpenAPIHono } from '@hono/zod-openapi'

import type { BaseAppBindings } from '@/types/app-bindings'

import { accountsRoute } from '@/src/routes/api/accounts'
import { inviteRoute } from '@/src/routes/api/invite'
import { registerRoute } from '@server/routes/api/register'

import auth from './admin/auth/auth.routes'
import sitesRoute from './admin/sites/site.routes'
import { usersRoute } from './users'

const apiRoute = new OpenAPIHono<BaseAppBindings>()

// auth routes
apiRoute.route('/admin/auth', auth)
apiRoute.route('/admin/sites', sitesRoute)
apiRoute.route('/users', usersRoute)
apiRoute.route('/invite', inviteRoute)
apiRoute.route('/accounts', accountsRoute)

// public routes
apiRoute.route('/register', registerRoute)

export { apiRoute }
