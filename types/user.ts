import { z } from '@hono/zod-openapi'

import { insertUsersSchema, selectUsersSchema } from '@db/users'

export const userCreateRequestSchema = insertUsersSchema.omit({ id: true })

export const userUpdateRequestSchema = userCreateRequestSchema
  .omit({ password: true, email: true })
  .partial()

export const userGetResponseSchema = selectUsersSchema.omit({ password: true })

export const userListResponseSchema = z.array(userGetResponseSchema)

export type UserCreateRequest = z.infer<typeof userCreateRequestSchema>
export type UserUpdateRequest = z.infer<typeof userUpdateRequestSchema>
export type UserGetResponse = z.infer<typeof userGetResponseSchema>
