import { OpenAPIHono } from '@hono/zod-openapi'
import { defaultHook } from 'stoker/openapi'

import type { BaseAppBindings } from '@/types/app-bindings'

import accountRoutes from '@/src/routes/api/admin/account/account.routes'
import authRoutes from '@/src/routes/api/admin/auth/auth.routes'
import sitesRoute from '@/src/routes/api/admin/site/site.routes'
import userRoutes from '@/src/routes/api/admin/user/user.routes'

const adminRoutes = new OpenAPIHono<BaseAppBindings>({ defaultHook })

// admin routes
adminRoutes.route('/auth', authRoutes)
adminRoutes.route('/site', sitesRoute)
adminRoutes.route('/account', accountRoutes)
adminRoutes.route('/user', userRoutes)

export default adminRoutes
