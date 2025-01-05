import { createRoute } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent } from 'stoker/openapi/helpers'
import { IdUUIDParamsSchema } from 'stoker/openapi/schemas'

import { notFoundContent, unauthorizedContent } from '@/src/common/openapi'
import { jwtAdminMiddleware, jwtMiddleware } from '@/src/middlewares/jwt'
import { siteListResponseSchema } from '@/types/sites'
import {
  userGetResponseSchema,
  userListResponseSchema,
  userUpdateRequestSchema,
} from '@/types/user'

const tags = ['User']

export const updateUser = createRoute({
  tags,
  summary: 'Update user',
  description: 'Update a user',
  method: 'put',
  path: '/{id}',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContent(userUpdateRequestSchema, 'Update user request'),
  },
  responses: {
    [HttpStatusCodes.ACCEPTED]: jsonContent(userGetResponseSchema, 'User updated successfully'),
    [HttpStatusCodes.NOT_FOUND]: notFoundContent(),
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
  },
  security: [{ Bearer: [] }],
})

export const deleteUser = createRoute({
  tags,
  summary: 'Delete user',
  description: 'Delete a user',
  method: 'delete',
  path: '/{id}',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'User deleted successfully',
    },
    [HttpStatusCodes.NOT_FOUND]: notFoundContent(),
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
  },
  security: [{ Bearer: [] }],
})

export const getUser = createRoute({
  tags,
  summary: 'Get user',
  description: 'Retrieve a user',
  method: 'get',
  path: '/{id}',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: {
      description: 'Retrieved user successfully',
      content: {
        'application/json': {
          schema: userGetResponseSchema,
        },
      },
    },
    [HttpStatusCodes.NOT_FOUND]: notFoundContent(),
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
  },
  security: [{ Bearer: [] }],
})

export const getUsers = createRoute({
  tags,
  summary: 'Get users',
  description: 'Retrieve all users',
  method: 'get',
  path: '/',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  responses: {
    [HttpStatusCodes.OK]: {
      description: 'Retrieved all users successfully',
      content: {
        'application/json': {
          schema: userListResponseSchema,
        },
      },
    },
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
  },
  security: [{ Bearer: [] }],
})

export const getUserSites = createRoute({
  tags,
  summary: 'Get user sites',
  description: 'Get user sites',
  method: 'get',
  path: '/{id}/sites',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(siteListResponseSchema, 'Retrieved user sites successfully'),
    [HttpStatusCodes.NOT_FOUND]: notFoundContent(),
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
  },
  security: [{ Bearer: [] }],
})
