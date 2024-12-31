import { defineWorkersConfig, readD1Migrations } from '@cloudflare/vitest-pool-workers/config'
import { faker } from '@faker-js/faker'
import { join } from 'node:path'
import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config'

const migrationsPath = join(__dirname, 'migrations')
const migrations = await readD1Migrations(migrationsPath)

export default defineConfig(configEnv =>
  mergeConfig(
    viteConfig(configEnv),
    defineWorkersConfig({
      test: {
        globals: true,
        setupFiles: ['./vitest/test-migrations.ts'],
        poolOptions: {
          workers: {
            wrangler: { configPath: './wrangler.toml' },
            miniflare: {
              bindings: {
                TEST_MIGRATIONS: migrations,
                AUTH_SECRET_KEY: faker.string.uuid(),
              },
            },
          },
        },
      },
    }),
  ),
)
