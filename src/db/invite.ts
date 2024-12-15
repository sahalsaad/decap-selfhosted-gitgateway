import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema } from 'drizzle-zod'

const invite = sqliteTable('invite', {
  id: text().notNull().primaryKey(),
  allowSetEmail: integer({ mode: 'boolean' }).notNull(),
  email: text().notNull().unique(),
  siteId: text().notNull().unique(),
  role: text({ enum: ['admin', 'contributor'] }).notNull(),
})

const insertInviteSchema = createInsertSchema(invite)

export { invite, insertInviteSchema }
