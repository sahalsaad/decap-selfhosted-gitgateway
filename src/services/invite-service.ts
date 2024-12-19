import { invite } from '@db/invite'
import type { InviteCreateRequest } from '@selfTypes/invite'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'

export const InviteService = (d1Database: D1Database) => {
  const db = drizzle(d1Database)

  return {
    createInvite: (inviteRequest: InviteCreateRequest) => {
      return db
        .insert(invite)
        .values({
          email: inviteRequest.email,
          siteId: inviteRequest.siteId,
          role: inviteRequest.role,
        })
        .returning({
          id: invite.id,
        })
        .get()
    },
    getInviteById: (inviteId: string) => {
      return db.select().from(invite).where(eq(invite.id, inviteId)).get()
    },
    deleteInvite: async (inviteId: string) =>
      await db.delete(invite).where(eq(invite.id, inviteId)).execute(),
  }
}
