import { sql } from 'drizzle-orm'
import { index, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema } from 'drizzle-zod'
import { sites } from './sites'
import { users } from './users'

const usersToSites = sqliteTable(
  'users_to_sites',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    siteId: text('site_id')
      .notNull()
      .references(() => sites.id),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [primaryKey({ columns: [table.userId, table.siteId] })]
)

const insertUsersToSitesSchema = createInsertSchema(usersToSites)

export { usersToSites, insertUsersToSitesSchema }
