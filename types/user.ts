import { z } from 'zod'
import { insertUsersSchema, selectUsersSchema } from '../src/db/users'
import { siteResponseSchema } from './sites'

const createUserSchema = insertUsersSchema.omit({ id: true })

type UserCreateRequest = z.infer<typeof createUserSchema>

const updateUserSchema = createUserSchema.omit({ password: true, email: true }).partial()

type UserUpdateRequest = z.infer<typeof updateUserSchema>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userResponseSchema = selectUsersSchema
  .omit({ password: true })
  .extend({ sites: z.array(siteResponseSchema) })

type UserResponse = z.infer<typeof userResponseSchema>

export { UserCreateRequest, createUserSchema, UserUpdateRequest, updateUserSchema, UserResponse }
