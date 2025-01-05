import { z } from '@hono/zod-openapi'

import { insertSitesSchema, selectSitesSchema } from '@db/sites'

const siteCreateRequestSchema = insertSitesSchema.omit({ id: true, createdAt: true })
const siteCreateResponseSchema = insertSitesSchema.pick({ id: true })
const siteGetResponseSchema = selectSitesSchema.omit({ gitToken: true })
const siteUpdateRequestSchema = siteCreateRequestSchema.partial()

const siteListResponseSchema = z.array(siteGetResponseSchema)

type SiteCreateRequest = z.infer<typeof siteCreateRequestSchema>
type SiteCreatedResponse = z.infer<typeof siteCreateResponseSchema>
type SiteUpdateRequest = z.infer<typeof siteUpdateRequestSchema>
type SiteGetResponse = z.infer<typeof siteGetResponseSchema>

export {
  SiteCreatedResponse,
  SiteCreateRequest,
  siteCreateRequestSchema,
  siteCreateResponseSchema,
  SiteGetResponse,
  siteGetResponseSchema,
  siteListResponseSchema,
  SiteUpdateRequest,
  siteUpdateRequestSchema,
}
