import { z } from '@hono/zod-openapi'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'
import { jsonContent } from 'stoker/openapi/helpers'
import { createErrorSchema, createMessageObjectSchema } from 'stoker/openapi/schemas'

export function notFoundContent(message = HttpStatusPhrases.NOT_FOUND) {
  return jsonContent(
    createMessageObjectSchema(message),
    HttpStatusPhrases.NOT_FOUND,
  )
}

export const unauthorizedContent = {
  description: HttpStatusPhrases.UNAUTHORIZED,
  content: {
    'text/plain': {
      schema: z.string().openapi({ example: HttpStatusPhrases.UNAUTHORIZED }),
    },
  },
}

export function validationErrorContent(schema: z.ZodTypeAny) {
  return jsonContent(
    createErrorSchema(schema),
    'The validation error(s)',
  )
}
