import { OpenAPIHono } from '@hono/zod-openapi'
import { registerRoute } from '@server/routes/api/register'
import { adminAuthRoute } from './auth'
import { sitesRoute } from './sites'
import { usersRoute } from './users'
import { accountsRoute } from '@/src/routes/api/accounts'
import { inviteRoute } from '@/src/routes/api/invite'
import type { BaseAppBindings } from '@/types/app-bindings'

const apiRoute = new OpenAPIHono<BaseAppBindings>()

// auth routes
apiRoute.route('/auth', adminAuthRoute)
apiRoute.route('/sites', sitesRoute)
apiRoute.route('/users', usersRoute)
apiRoute.route('/invite', inviteRoute)
apiRoute.route('/accounts', accountsRoute)

// public routes
apiRoute.route('/register', registerRoute)

export { apiRoute }
