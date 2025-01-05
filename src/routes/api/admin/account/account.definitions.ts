import { createRoute } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent } from 'stoker/openapi/helpers'

import { notFoundContent, unauthorizedContent } from '@/src/common/openapi'
import { jwtAdminMiddleware, jwtMiddleware } from '@/src/middlewares/jwt'
import { inviteRequestSchema, inviteResponseSchema } from '@/types/invite'
import { resetPasswordRequestSchema, resetPasswordResponseSchema } from '@/types/password'

const tags = ['Account']

export const resetPassword = createRoute({
  tags,
  description: 'Reset password',
  method: 'post',
  path: '/reset-password',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    body: {
      content: {
        'application/json': {
          schema: resetPasswordRequestSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      resetPasswordResponseSchema,
      'Password reset successfully',
    ),
    [HttpStatusCodes.NOT_FOUND]: notFoundContent(),
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
  },
  security: [{ Bearer: [] }],
})

export const createInvite = createRoute({
  tags,
  description: 'Create an invite. If user already registered, please use `site/{id}/user` to add user to a site.',
  method: 'post',
  path: '/invite',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    body: {
      content: {
        'application/json': {
          schema: inviteRequestSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.CREATED]: {
      description: 'Invite created successfully',
      content: {
        'application/json': {
          schema: inviteResponseSchema,
        },
      },
    },
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
  },
  security: [{ Bearer: [] }],
})
