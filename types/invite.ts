import { insertInviteSchema } from '@db/invite'
import { z } from 'zod'
import { userCreateRequestSchema } from '@/types/user'

const inviteCreateRequestSchema = insertInviteSchema
const inviteHandleRequestSchema = userCreateRequestSchema
  .omit({ role: true })
  .extend({ inviteId: z.string() })

type InviteCreateRequest = z.infer<typeof inviteCreateRequestSchema>

export { inviteCreateRequestSchema, inviteHandleRequestSchema, InviteCreateRequest }
