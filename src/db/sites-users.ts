import { sql } from 'drizzle-orm'
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { sites } from './sites'
import { users } from './users'

const sitesUsers = sqliteTable(
  'sites_users',
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
  table => [primaryKey({ columns: [table.userId, table.siteId] })],
)

export { sitesUsers }
