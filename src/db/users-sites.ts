import { users } from "./users";
import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sites } from "./sites";

export const usersToSites = sqliteTable(
  "users_to_sites",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    siteId: text("site_id")
      .notNull()
      .references(() => sites.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.siteId] }),
  }),
);
