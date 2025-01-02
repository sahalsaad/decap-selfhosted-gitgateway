import { z } from 'zod'

import { userCreateRequestSchema } from '@/types/user'
import { insertInviteSchema } from '@db/invite'

export const inviteRequestSchema = insertInviteSchema.omit({ id: true, createdAt: true })
export const inviteHandleRequestSchema = userCreateRequestSchema
  .omit({ role: true })
  .extend({ inviteId: z.string() })

export const inviteResponseSchema = z.object({
  inviteUrl: z.string().url(),
})

export type InviteCreateRequest = z.infer<typeof inviteRequestSchema>
