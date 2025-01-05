import { OpenAPIHono } from '@hono/zod-openapi'
import { defaultHook } from 'stoker/openapi'

import type { BaseAppBindings } from '@/types/app-bindings'

import adminRoutes from '@/src/routes/api/admin'
import registerRoute from '@/src/routes/api/client/register'
import setPasswordRoute from '@/src/routes/api/client/update-password'

const apiRoute = new OpenAPIHono<BaseAppBindings>({ defaultHook })

// admin routes
apiRoute.route('/admin', adminRoutes)

// client routes
apiRoute.route('/register', registerRoute)
apiRoute.route('/update-password', setPasswordRoute)

export { apiRoute }
