import { z } from 'zod'
import { insertUsersSchema, selectUsersSchema } from '../src/db/users'
import { siteGetResponseSchema } from './sites'

const userCreateRequestSchema = insertUsersSchema.omit({ id: true })
const userUpdateRequestSchema = userCreateRequestSchema
  .omit({ password: true, email: true })
  .partial()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userGetResponseSchema = selectUsersSchema
  .omit({ password: true })
  .extend({ sites: z.array(siteGetResponseSchema) })

type UserCreateRequest = z.infer<typeof userCreateRequestSchema>
type UserUpdateRequest = z.infer<typeof userUpdateRequestSchema>
type UserGetResponse = z.infer<typeof userGetResponseSchema>

export {
  UserCreateRequest,
  userCreateRequestSchema,
  UserUpdateRequest,
  userUpdateRequestSchema,
  UserGetResponse,
}
