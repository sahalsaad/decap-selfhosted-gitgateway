import {int, sqliteTable, text} from "drizzle-orm/sqlite-core";

export const sites = sqliteTable("sites", {
    id: int().primaryKey({ autoIncrement: true }),
    url: text().notNull().unique(),
    githubToken: text().notNull(),
})