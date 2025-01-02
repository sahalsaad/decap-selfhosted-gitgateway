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
  table => [unique().on(table.email)],
)

const insertInviteSchema = createInsertSchema(invite, {
  email: schema => schema.openapi({ description: 'The email of the user. If not specified, user can set their own email during registration.' }),
  siteId: schema => schema.openapi({ description: 'The site ID. If not specified, user will not be added to any site. Its an option to create admin user.' }),
  role: schema => schema.openapi({ description: 'The user role. If not specified, it will default to contributor.' }),
})

export { insertInviteSchema, invite }
