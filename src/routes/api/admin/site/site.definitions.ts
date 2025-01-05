import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'
import { jsonContent } from 'stoker/openapi/helpers'
import {
  createMessageObjectSchema,
  IdUUIDParamsSchema,
} from 'stoker/openapi/schemas'

import { notFoundContent, unauthorizedContent, validationErrorContent } from '@/src/common/openapi'
import { jwtAdminMiddleware, jwtMiddleware } from '@/src/middlewares/jwt'
import { userEmailSchema } from '@/types/account'
import {
  siteCreateRequestSchema,
  siteGetResponseSchema,
  siteUpdateRequestSchema,
} from '@/types/sites'
import { userListResponseSchema } from '@/types/user'

const tags = ['Site']

const userEmailJsonContent = jsonContent(userEmailSchema, 'User email')

export const createSite = createRoute({
  tags,
  summary: 'Create site',
  description: 'Create a new site',
  method: 'post',
  path: '/',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    body: jsonContent(siteCreateRequestSchema, 'Create site request'),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      siteGetResponseSchema,
      'New site created successfully',
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema('Site already exists'),
      HttpStatusPhrases.BAD_REQUEST,
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorContent(siteCreateRequestSchema),
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
  },
  security: [{ Bearer: [] }],
})

export const getSite = createRoute({
  tags,
  summary: 'Get site',
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
  summary: 'Update site',
  description: 'Update a site',
  method: 'put',
  path: '/{id}',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContent(siteUpdateRequestSchema, 'Update site request'),
  },
  required: true,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(siteGetResponseSchema, 'Site updated successfully'),
    [HttpStatusCodes.NOT_FOUND]: notFoundContent(),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorContent(siteUpdateRequestSchema),
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
  },
  security: [{ Bearer: [] }],
})

export const deleteSite = createRoute({
  tags,
  summary: 'Delete site',
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
  summary: 'Get sites',
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
  summary: 'Add user',
  description: 'Add user to a site',
  method: 'put',
  path: '/{id}/user',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    params: IdUUIDParamsSchema,
    body: userEmailJsonContent,
    required: true,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'User added to site successfully',
    },
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema('User already added to the site'),
      'User already added to the site',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorContent(userEmailSchema),
    [HttpStatusCodes.NOT_FOUND]: notFoundContent(),
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
  },
  security: [{ Bearer: [] }],
})

export const removeUserFromSite = createRoute({
  tags,
  summary: 'Remove user',
  description: 'Remove user from a site',
  method: 'delete',
  path: '/{id}/user',
  middleware: [jwtMiddleware, jwtAdminMiddleware] as const,
  request: {
    params: IdUUIDParamsSchema,
    body: userEmailJsonContent,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'User removed from site successfully',
    },
    [HttpStatusCodes.NOT_FOUND]: notFoundContent('User not found.'),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema('User not in the site'),
      'User not in the site',
    ),
    [HttpStatusCodes.UNAUTHORIZED]: unauthorizedContent,
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorContent(userEmailSchema),
  },
  security: [{ Bearer: [] }],
})

export const getSiteUsers = createRoute({
  tags,
  summary: 'Get users',
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
    [HttpStatusCodes.NOT_FOUND]: notFoundContent('Site not found.'),
  },
  security: [{ Bearer: [] }],
})
