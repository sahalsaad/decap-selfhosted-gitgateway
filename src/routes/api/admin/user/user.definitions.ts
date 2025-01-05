import { createRoute } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { IdUUIDParamsSchema } from 'stoker/openapi/schemas'

import { notFoundContent, unauthorizedContent } from '@/src/common/openapi'
import { jwtAdminMiddleware, jwtMiddleware } from '@/src/middlewares/jwt'
import {
  userGetResponseSchema,
  userListResponseSchema,
  userUpdateRequestSchema,
} from '@/types/user'

const tags = ['User']

export const updateUser = createRoute({
  tags,
  description: 'Update a user',
  method: 'put',
  path: '/{id}',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    params: IdUUIDParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: userUpdateRequestSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'User updated successfully',
    },
    [HttpStatusCodes.NOT_FOUND]: notFoundContent(),
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
  },
  security: [{ Bearer: [] }],
})

export const deleteUser = createRoute({
  tags,
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
