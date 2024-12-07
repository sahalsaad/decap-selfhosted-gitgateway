import { drizzle } from "drizzle-orm/d1";
import { users } from "../db/users";
import { hashPassword } from "./encryption-service";
import { and, eq } from "drizzle-orm";
import { usersToSites } from "../db/users-sites";
import { sites } from "../db/sites";
import { randomUUID } from "node:crypto";

export const UserService = (d1Database: D1Database, authSecretKey: string) => {
  const db = drizzle(d1Database);

  return {
    getUserById: async (userId: string) => {
      const rows = await db
        .select({
          users: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            role: users.role,
          },
          sites: {
            id: sites.id,
            url: sites.url,
            gitRepo: sites.gitRepo,
          },
        })
        .from(users)
        .leftJoin(usersToSites, eq(usersToSites.userId, users.id))
        .leftJoin(sites, eq(usersToSites.siteId, sites.id))
        .where(eq(users.id, userId))
        .all();

      const result = rows.reduce<Record<string, UserResponse>>((acc, row) => {
        const user = row.users!;
        const site = row.sites;
        if (!acc[user.id]) {
          acc[user.id] = { ...user, sites: [] };
        }
        if (site) {
          acc[user.id].sites.push(site);
        }
        return acc;
      }, {});

      const firstResult = result[userId];

      if (!firstResult) {
        return null;
      }

      return firstResult;
    },
    getUserByEmailAndSite: async (email: string, siteId: string) => {
      const result = await db
        .select()
        .from(users)
        .leftJoin(usersToSites, eq(usersToSites.userId, users.id))
        .leftJoin(sites, eq(sites.id, usersToSites.siteId))
        .where(and(eq(users.email, email), eq(usersToSites.siteId, siteId)))
        .get();

      if (!result) {
        return null;
      }

      return {
        user: result.users,
        site: result.sites!,
      };
    },
    getUserByEmail: async (email: string) => {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .get();

      if (!result) {
        return null;
      }

      return result;
    },
    getAllUser: async () => {
      return await db.select().from(users).all();
    },
    create: (userRequest: UserRequest) => {
      const hashedPassword = hashPassword(userRequest.password, authSecretKey);

      return db
        .insert(users)
        .values({
          id: randomUUID(),
          firstName: userRequest.firstName,
          lastName: userRequest.lastName,
          email: userRequest.email,
          password: hashedPassword,
          role: userRequest.role,
        })
        .returning({
          id: users.id,
        });
    },
    updateUser: async (userId: string, userRequest: UserRequest) => {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .get();
      if (!existingUser) {
        throw new Error("User not found");
      }

      const email = userRequest.email || existingUser.email;
      const firstName = userRequest.firstName || existingUser.firstName;
      const lastName = userRequest.lastName || existingUser.lastName;
      const password = userRequest.password
        ? hashPassword(userRequest.password, authSecretKey)
        : existingUser.password;
      const role = userRequest.role || existingUser.role;

      const result = await db
        .update(users)
        .set({
          firstName,
          lastName,
          password,
          email,
          role,
        })
        .where(eq(users.id, userId));
      return result.success;
    },
    deleteUser: async (userId: string) => {
      const result = await db.delete(users).where(eq(users.id, userId));
      return result.success;
    },
    addUserSite: async (userId: string, siteId: string) => {
      const result = await db
        .insert(usersToSites)
        .values({ siteId: siteId, userId: userId });
      return result.success;
    },
  };
};
