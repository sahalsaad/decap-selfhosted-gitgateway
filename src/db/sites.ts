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
    gitProvider: text('git_provider', { enum: ['github', 'gitlab', 'bitbucket'] })
      .notNull()
      .default('github'),
    gitHost: text('git_host'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [unique().on(table.cmsUrl), index('site_id_index').on(table.id)]
)

const insertSitesSchema = createInsertSchema(sites)
const selectSitesSchema = createSelectSchema(sites)

export { sites, insertSitesSchema, selectSitesSchema }
