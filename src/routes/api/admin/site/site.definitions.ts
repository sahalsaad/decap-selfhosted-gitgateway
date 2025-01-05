import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'
import { jsonContent } from 'stoker/openapi/helpers'
import {
  createMessageObjectSchema,
  IdUUIDParamsSchema,
} from 'stoker/openapi/schemas'

import { notFoundContent, unauthorizedContent } from '@/src/common/openapi'
import { jwtAdminMiddleware, jwtMiddleware } from '@/src/middlewares/jwt'
import {
  siteCreateRequestSchema,
  siteCreateResponseSchema,
  siteGetResponseSchema,
  siteUpdateRequestSchema,
} from '@/types/sites'
import { userListResponseSchema } from '@/types/user'

const tags = ['Site']

export const createSite = createRoute({
  tags,
  description: 'Create a new site',
  method: 'post',
  path: '/',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    body: {
      content: {
        'application/json': {
          schema: siteCreateRequestSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      siteCreateResponseSchema,
      'New site created successfully',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrases.BAD_REQUEST),
      HttpStatusPhrases.BAD_REQUEST,
    ),
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
  },
  security: [{ Bearer: [] }],
})

export const getSite = createRoute({
  tags,
  description: 'Retrieve a site',
  method: 'get',
  path: '/{id}',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      siteGetResponseSchema,
      'Retrieved site successfully',
    ),
    [HttpStatusCodes.NOT_FOUND]: notFoundContent(),
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
  },
  security: [{ Bearer: [] }],
})

export const updateSite = createRoute({
  tags,
  description: 'Update a site',
  method: 'put',
  path: '/{id}',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    params: IdUUIDParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: siteUpdateRequestSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(siteGetResponseSchema, 'Site updated successfully'),
    [HttpStatusCodes.NOT_FOUND]: notFoundContent(),
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
  },
  security: [{ Bearer: [] }],
})

export const deleteSite = createRoute({
  tags,
  description: 'Delete a site',
  method: 'delete',
  path: '/{id}',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Site deleted successfully',
    },
    [HttpStatusCodes.NOT_FOUND]: notFoundContent(),
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
  },
  security: [{ Bearer: [] }],
})

export const getSites = createRoute({
  tags,
  description: 'Retrieve all sites',
  method: 'get',
  path: '/',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(siteGetResponseSchema),
      'Retrieved all sites successfully',
    ),
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
  },
  security: [{ Bearer: [] }],
})

export const addUserToSite = createRoute({
  tags,
  description: 'Add user to a site',
  method: 'put',
  path: '/{id}/user',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    params: IdUUIDParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            email: z.string().email().openapi({ description: 'The email of the user.' }),
          }),
        },
      },
    },
    required: true,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'User added to site successfully',
    },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createMessageObjectSchema('User already added to the site'),
      'User already added to the site',
    ),
    [HttpStatusCodes.NOT_FOUND]: notFoundContent(),
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
  },
  security: [{ Bearer: [] }],
})

export const removeUserFromSite = createRoute({
  tags,
  description: 'Remove user from a site',
  method: 'delete',
  path: '/{id}/user',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    params: IdUUIDParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            email: z.string().email().openapi({ description: 'The email of the user.' }),
          }),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'User removed from site successfully',
    },
    [HttpStatusCodes.NOT_FOUND]: notFoundContent('User not found.'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createMessageObjectSchema('User not in the site'),
      'User not in the site',
    ),
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
  },
  security: [{ Bearer: [] }],
})

export const getSiteUsers = createRoute({
  tags,
  description: 'Get users of a site',
  method: 'get',
  path: '/{id}/user',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(userListResponseSchema, 'Get users of a site successfully'),
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
  },
  security: [{ Bearer: [] }],
})
