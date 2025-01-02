import { z } from 'zod'

import { siteGetResponseSchema } from '@/types/sites'
import { insertUsersSchema, selectUsersSchema } from '@db/users'

export const userCreateRequestSchema = insertUsersSchema.omit({ id: true })

export const userUpdateRequestSchema = userCreateRequestSchema
  .omit({ password: true, email: true })
  .partial()

export const userGetResponseSchema = selectUsersSchema
  .omit({ password: true })
  .extend({ sites: z.array(siteGetResponseSchema) })

export const userListResponseSchema = z.array(selectUsersSchema.omit({ password: true }))

export type UserCreateRequest = z.infer<typeof userCreateRequestSchema>
export type UserUpdateRequest = z.infer<typeof userUpdateRequestSchema>
export type UserGetResponse = z.infer<typeof userGetResponseSchema>
