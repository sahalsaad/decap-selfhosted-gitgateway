import type { Variables } from '@selfTypes/variables'
import { registerRoute } from '@server/routes/api/register'
import { Hono } from 'hono'
import { adminAuthRoute } from './auth'
import { sitesRoute } from './sites'
import { usersRoute } from './users'
import { inviteRoute } from '@/src/routes/api/invite'

const apiRoute = new Hono<{
  Bindings: CloudflareBindings
  Variables: Variables
}>()

// auth routes
apiRoute.route('/auth', adminAuthRoute)
apiRoute.route('/sites', sitesRoute)
apiRoute.route('/users', usersRoute)
apiRoute.route('/invite', inviteRoute)

// public routes
apiRoute.route('/register', registerRoute)

export { apiRoute }
