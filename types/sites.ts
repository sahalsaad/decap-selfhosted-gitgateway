import type { z } from 'zod'
import { insertSitesSchema, selectSitesSchema } from '../src/db/sites'

const siteCreateRequestSchema = insertSitesSchema.omit({ id: true, createdAt: true })
const siteCreateResponseSchema = insertSitesSchema.pick({ id: true })
const siteGetResponseSchema = selectSitesSchema.omit({ gitToken: true })
const siteUpdateRequestSchema = siteCreateRequestSchema.partial()

type SiteCreateRequest = z.infer<typeof siteCreateRequestSchema>
type SiteCreatedResponse = z.infer<typeof siteCreateResponseSchema>
type SiteUpdateRequest = z.infer<typeof siteUpdateRequestSchema>
type SiteGetResponse = z.infer<typeof siteGetResponseSchema>

export {
  siteCreateRequestSchema,
  siteUpdateRequestSchema,
  siteGetResponseSchema,
  siteCreateResponseSchema,
  SiteCreateRequest,
  SiteUpdateRequest,
  SiteCreatedResponse,
  SiteGetResponse,
}
