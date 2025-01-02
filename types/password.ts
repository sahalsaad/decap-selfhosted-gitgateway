import { z } from 'zod'

export const resetPasswordRequestSchema = z.object({
  email: z.string().email(),
})

export const setPasswordRequestSchema = z.object({
  email: z.string().email(),
  currentPassword: z.string(),
  newPassword: z.string(),
})

export const resetPasswordResponseSchema = z.object({
  temporaryPassword: z.string().url(),
})
