import { OpenAPIHono } from '@hono/zod-openapi'
import { defaultHook } from 'stoker/openapi'

import type { BaseAppBindings } from '@/types/app-bindings'

import accountRoutes from '@/src/routes/api/admin/account/account.routes'
import authRoutes from '@/src/routes/api/admin/auth/auth.routes'
import sitesRoute from '@/src/routes/api/admin/site/site.routes'
import userRoutes from '@/src/routes/api/admin/user/user.routes'
import registerRoute from '@/src/routes/api/client/register'
import setPasswordRoute from '@/src/routes/api/client/update-password'

const apiRoute = new OpenAPIHono<BaseAppBindings>({ defaultHook })

// admin routes
apiRoute.route('/admin/auth', authRoutes)
apiRoute.route('/admin/site', sitesRoute)
apiRoute.route('/admin/account', accountRoutes)
apiRoute.route('/admin/user', userRoutes)

// client routes
apiRoute.route('/register', registerRoute)
apiRoute.route('/update-password', setPasswordRoute)

export { apiRoute }
