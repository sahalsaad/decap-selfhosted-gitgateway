import { createRoute } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent } from 'stoker/openapi/helpers'

import { notFoundContent, unauthorizedContent, validationErrorContent } from '@/src/common/openapi'
import { jwtAdminMiddleware, jwtMiddleware } from '@/src/middlewares/jwt'
import { resetPasswordResponseSchema, userEmailSchema } from '@/types/account'
import { inviteRequestSchema, inviteResponseSchema } from '@/types/invite'

const tags = ['Account']

export const resetPassword = createRoute({
  tags,
  summary: 'Reset password',
  description: 'Reset user password',
  method: 'post',
  path: '/reset-password',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    body: jsonContent(userEmailSchema, 'Reset password request'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      resetPasswordResponseSchema,
      'Password reset successfully',
    ),
    [HttpStatusCodes.NOT_FOUND]: notFoundContent(),
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorContent(userEmailSchema),
  },
  security: [{ Bearer: [] }],
})

export const createInvite = createRoute({
  tags,
  summary: 'Invite new user',
  description: 'Invite a new user. If user already registered, please use `site/{id}/user` to add user to a site.',
  method: 'post',
  path: '/invite',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    body: jsonContent(inviteRequestSchema, 'Invite request'),
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
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorContent(inviteRequestSchema),
  },
  security: [{ Bearer: [] }],
})
