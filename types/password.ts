import { z } from 'zod'

const resetPasswordRequestSchema = z.object({
  email: z.string().email(),
})

const setPasswordRequestSchema = z.object({
  email: z.string().email(),
  currentPassword: z.string(),
  newPassword: z.string(),
})

export { resetPasswordRequestSchema, setPasswordRequestSchema }
