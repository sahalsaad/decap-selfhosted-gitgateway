import {sqliteTable, text} from "drizzle-orm/sqlite-core";

export const sites = sqliteTable("sites", {
    id: text().notNull().primaryKey(),
    url: text().notNull().unique(),
    gitToken: text().notNull(),
    gitRepo: text().notNull(),
    tokenNonce: text().notNull(),
})