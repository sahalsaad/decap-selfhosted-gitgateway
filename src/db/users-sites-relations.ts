import {relations} from "drizzle-orm";
import {users} from "./users";
import {int, primaryKey, sqliteTable} from "drizzle-orm/sqlite-core";
import {sites} from "./sites";

export const usersRelations = relations(users, ({ many }) => ({
    usersToGroups: many(usersToSites),
}));

export const sitesRelations = relations(sites, ({ many }) => ({
    usersToGroups: many(usersToSites),
}));

export const usersToSites = sqliteTable(
    'users_to_sites',
    {
        userId: int('user_id')
            .notNull()
            .references(() => users.id),
        siteId: int('site_id')
            .notNull()
            .references(() => sites.id),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.userId, t.siteId] }),
    }),
);

export const usersToSitesRelations = relations(usersToSites, ({ one }) => ({
    group: one(sites, {
        fields: [usersToSites.siteId],
        references: [sites.id],
    }),
    user: one(users, {
        fields: [usersToSites.userId],
        references: [users.id],
    }),
}));