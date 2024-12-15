import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
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
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.siteId] }),
  })
)

const insertUsersToSitesSchema = createInsertSchema(usersToSites)

export { usersToSites, insertUsersToSitesSchema }
