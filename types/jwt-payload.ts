import type { JWTPayload } from 'hono/utils/jwt/types'

export interface JwtPayload extends JWTPayload {
  user: {
    firstName: string
    lastName: string | null
    email: string
    id: string
  }
  git: {
    token: string
    provider: 'github' | 'gitlab' | 'bitbucket'
    host: string | null
    repo: string
  }
}
