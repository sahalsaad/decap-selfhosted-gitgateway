import { sql } from 'drizzle-orm'
import { index, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { randomUUID } from 'node:crypto'

const sites = sqliteTable(
  'sites',
  {
    id: text('id')
      .notNull()
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    cmsUrl: text('cms_url').notNull(),
    gitToken: text('git_token').notNull(),
    gitRepo: text('git_repo').notNull(),
    gitProvider: text('git_provider', {
      enum: ['github', 'gitlab', 'bitbucket'],
    })
      .notNull()
      .default('github'),
    gitHost: text('git_host'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  table => [unique().on(table.cmsUrl), index('site_id_index').on(table.id)],
)

const insertSitesSchema = createInsertSchema(sites, {
  cmsUrl: schema => schema.openapi({ description: 'The URL of the CMS', example: 'https://example.com/admin' }),
  gitToken: schema => schema.openapi({ description: 'The Git PAT token' }),
  gitRepo: schema => schema.openapi({ description: 'The Git repository URL' }),
  gitProvider: schema => schema.openapi({ description: 'The Git provider. If not specified, it will default to GitHub' }),
  gitHost: schema => schema.openapi({ description: 'The Git host. If not specified, it will be default to Git host based on the provider(e.g. github.com)' }),
})
const selectSitesSchema = createSelectSchema(sites)

export { insertSitesSchema, selectSitesSchema, sites }
