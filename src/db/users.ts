import { sql } from 'drizzle-orm'
import { index, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { randomUUID } from 'node:crypto'

const users = sqliteTable(
  'users',
  {
    id: text('id')
      .notNull()
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    email: text('email').notNull(),
    password: text('password').notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name'),
    role: text({ enum: ['admin', 'contributor'] }).notNull(),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  table => [
    index('users_id_index').on(table.id),
    index('users_email_index').on(table.email),
    unique().on(table.email),
  ],
)

const insertUsersSchema = createInsertSchema(users)
const selectUsersSchema = createSelectSchema(users)

export { insertUsersSchema, selectUsersSchema, users }
