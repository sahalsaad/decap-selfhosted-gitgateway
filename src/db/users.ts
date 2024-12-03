import {int, primaryKey, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {relations} from "drizzle-orm";
import {sites} from "./sites";

export const users = sqliteTable("users", {
    id: int().primaryKey({ autoIncrement: true }),
    email: text().notNull().unique(),
    password: text().notNull(),
    firstName: text().notNull(),
    lastName: text(),
    role: text('role').$type<'admin' | 'contributor'>().notNull(),
});