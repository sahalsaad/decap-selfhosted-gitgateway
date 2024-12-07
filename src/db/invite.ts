import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const invite = sqliteTable("invite", {
  id: text().notNull().primaryKey(),
  allowSetEmail: integer({ mode: "boolean" }).notNull(),
  email: text().notNull().unique(),
  siteId: text().notNull().unique(),
  role: text().$type<"admin" | "contributor">().notNull(),
});
