import { insertInviteSchema } from '@db/invite'
import { z } from 'zod'
import { userCreateRequestSchema } from '@/types/user'

const inviteCreateRequestSchema = insertInviteSchema

type InviteCreateRequest = z.infer<typeof inviteCreateRequestSchema>

const inviteHandleRequestSchema = userCreateRequestSchema
  .omit({ role: true })
  .extend({ inviteId: z.string() })

export { InviteCreateRequest, inviteCreateRequestSchema, inviteHandleRequestSchema }
