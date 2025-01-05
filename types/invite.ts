import { z } from '@hono/zod-openapi'

import { userCreateRequestSchema } from '@/types/user'
import { insertInviteSchema } from '@db/invite'

export const inviteRequestSchema = insertInviteSchema.omit({ id: true, createdAt: true }).partial()
export const inviteHandleRequestSchema = userCreateRequestSchema
  .omit({ role: true })
  .extend({ inviteId: z.string() })

export const inviteResponseSchema = z.object({
  inviteUrl: z.string().url().openapi({ example: 'https://example.com/register?invite=a8857ccb-1b07-43e3-a907-e8ef8f611635' }),
})

export type InviteCreateRequest = z.infer<typeof inviteRequestSchema>
