import { drizzle } from "drizzle-orm/d1";
import { invite } from "../db/invite";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";

export const InviteService = (d1Database: D1Database) => {
  const db = drizzle(d1Database);

  return {
    createInvite: async (
      email: string,
      siteId: string,
      role: "admin" | "contributor",
    ) => {
      return db
        .insert(invite)
        .values({
          id: randomUUID(),
          allowSetEmail: false,
          email: email,
          siteId: siteId,
          role: role,
        })
        .returning({
          id: invite.id,
        });
    },
    getInviteById: (inviteId: string) => {
      return db.select().from(invite).where(eq(invite.id, inviteId)).get();
    },
    deleteInvite: async (inviteId: string) =>
      await db.delete(invite).where(eq(invite.id, inviteId)).execute(),
  };
};
