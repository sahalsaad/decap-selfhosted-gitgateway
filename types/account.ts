import { z } from '@hono/zod-openapi'

export const userEmailSchema = z.object({
  email: z.string().email().openapi({ description: 'The email of the user.' }),
})

export const setPasswordRequestSchema = z.object({
  email: z.string().email(),
  currentPassword: z.string(),
  newPassword: z.string(),
})

export const resetPasswordResponseSchema = z.object({
  temporaryPassword: z.string(),
})
