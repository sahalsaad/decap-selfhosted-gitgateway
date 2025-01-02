import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent } from 'stoker/openapi/helpers'
import {
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
    [HttpStatusCodes.NOT_FOUND]: notFoundContent,
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
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Site updated successfully',
    },
    [HttpStatusCodes.NOT_FOUND]: notFoundContent,
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
    [HttpStatusCodes.NOT_FOUND]: notFoundContent,
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
