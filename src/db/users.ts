import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const users = sqliteTable("users", {
  id: text().notNull().primaryKey(),
  email: text().notNull().unique(),
  password: text().notNull(),
  firstName: text().notNull(),
  lastName: text(),
  role: text({ enum: ["admin", "contributor"] }).notNull(),
});

const insertUsersSchema = createInsertSchema(users);
const selectUsersSchema = createSelectSchema(users);

export { users, insertUsersSchema, selectUsersSchema };
