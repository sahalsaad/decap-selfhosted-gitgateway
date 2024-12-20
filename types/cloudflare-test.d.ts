declare module 'cloudflare:test' {
  interface ProvidedEnv {
    DB: D1Database
    AUTH_SECRET_KEY: string
    TEST_MIGRATIONS: D1Migration[]
  }
}
