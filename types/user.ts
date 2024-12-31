import { z } from 'zod'

import { siteGetResponseSchema } from '@/types/sites'
import { insertUsersSchema, selectUsersSchema } from '@db/users'

const userCreateRequestSchema = insertUsersSchema.omit({ id: true })
const userUpdateRequestSchema = userCreateRequestSchema
  .omit({ password: true, email: true })
  .partial()
// eslint-disable-next-line unused-imports/no-unused-vars
const userGetResponseSchema = selectUsersSchema
  .omit({ password: true })
  .extend({ sites: z.array(siteGetResponseSchema) })

type UserCreateRequest = z.infer<typeof userCreateRequestSchema>
type UserUpdateRequest = z.infer<typeof userUpdateRequestSchema>
type UserGetResponse = z.infer<typeof userGetResponseSchema>

export {
  UserCreateRequest,
  userCreateRequestSchema,
  UserGetResponse,
  UserUpdateRequest,
  userUpdateRequestSchema,
}
