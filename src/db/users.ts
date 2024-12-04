import {int, primaryKey, sqliteTable, text} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
    id: text().notNull().primaryKey(),
    email: text().notNull().unique(),
    password: text().notNull(),
    firstName: text().notNull(),
    lastName: text(),
    role: text('role').$type<'admin' | 'contributor'>().notNull(),
});