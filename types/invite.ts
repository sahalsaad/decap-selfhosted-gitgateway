import { insertInviteSchema } from '@db/invite'
import { z } from 'zod'
import { createUserSchema } from '@/types/user'

const createInviteSchema = insertInviteSchema

type InviteCreateRequest = z.infer<typeof createInviteSchema>

const handleInviteSchema = createUserSchema.omit({ role: true }).extend({ inviteId: z.string() })

export { InviteCreateRequest, createInviteSchema, handleInviteSchema }
