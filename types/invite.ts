import { z } from 'zod'

import { userCreateRequestSchema } from '@/types/user'
import { insertInviteSchema } from '@db/invite'

const inviteCreateRequestSchema = insertInviteSchema
const inviteHandleRequestSchema = userCreateRequestSchema
  .omit({ role: true })
  .extend({ inviteId: z.string() })

type InviteCreateRequest = z.infer<typeof inviteCreateRequestSchema>

export { InviteCreateRequest, inviteCreateRequestSchema, inviteHandleRequestSchema }
