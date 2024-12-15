import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

const sites = sqliteTable('sites', {
  id: text().notNull().primaryKey(),
  url: text().notNull().unique(),
  gitToken: text().notNull(),
  gitRepo: text().notNull(),
  gitProvider: text({ enum: ['github', 'gitlab', 'bitbucket'] }).notNull(),
  gitHost: text(),
})

const insertSitesSchema = createInsertSchema(sites)
const selectSitesSchema = createSelectSchema(sites)

export { sites, insertSitesSchema, selectSitesSchema }
