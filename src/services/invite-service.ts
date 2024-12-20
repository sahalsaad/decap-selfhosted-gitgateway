import { invite } from '@db/invite'
import type { InviteCreateRequest } from '@selfTypes/invite'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'

export const InviteService = (d1Database: D1Database) => {
  const db = drizzle(d1Database)

  return {
    createInvite: async (inviteRequest: InviteCreateRequest) => {
      haveExistingInvite: if (inviteRequest.email) {
        const existingInvite = await db
          .select({
            id: invite.id,
            siteId: invite.siteId,
          })
          .from(invite)
          .where(eq(invite.email, inviteRequest.email))
          .get()

        if (!existingInvite) {
          break haveExistingInvite
        }

        if (existingInvite.siteId !== inviteRequest.siteId) {
          await db
            .update(invite)
            .set({ siteId: inviteRequest.siteId })
            .where(eq(invite.id, existingInvite.id))
        }

        return {
          id: existingInvite.id,
        }
      }

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
    deleteInvite: async (inviteId: string) => {
      const result = await db.delete(invite).where(eq(invite.id, inviteId)).execute()
      return result.meta.rows_written === 1
    },
  }
}
