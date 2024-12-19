import { sql } from 'drizzle-orm'
import { sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import { createInsertSchema } from 'drizzle-zod'
import { randomUUID } from 'node:crypto'

const invite = sqliteTable(
  'invite',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => randomUUID()),
    email: text('email'),
    siteId: text('site_id'),
    role: text('role', { enum: ['admin', 'contributor'] })
      .notNull()
      .default('contributor'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [unique().on(table.email, table.siteId)]
)

const insertInviteSchema = createInsertSchema(invite)

export { invite, insertInviteSchema }
