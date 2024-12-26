import { faker } from '@faker-js/faker'
import { hashPassword } from '@services/encryption-service'
import { env } from 'cloudflare:test'
import { sign } from 'hono/jwt'
import type { UserCreateRequest } from '@/types/user'

const generateSiteRequest = () => ({
  cmsUrl: faker.internet.url(),
  gitToken: faker.string.uuid(),
  gitRepo: faker.internet.url(),
  gitProvider: faker.helpers.arrayElement(['github', 'gitlab', 'bitbucket']),
  gitHost: faker.internet.url(),
})

const generateUserCreateRequest = (): UserCreateRequest => ({
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  password: faker.internet.password(),
  role: faker.helpers.arrayElement(['admin', 'contributor']),
})

const MOCK_ENV = {
  DB: env.DB,
  AUTH_SECRET_KEY: faker.string.uuid(),
}

const fakeAdminToken = await sign(
  { user: { id: 'fake-user-id', role: 'admin' } },
  MOCK_ENV.AUTH_SECRET_KEY
)

const fakeContributorToken = await sign(
  { user: { id: 'fake-user-id', role: 'contributor' } },
  MOCK_ENV.AUTH_SECRET_KEY
)

const fakeUserAndSiteData = (password: string) => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  role: 'contributor',
  password: hashPassword(password, MOCK_ENV.AUTH_SECRET_KEY!),
  sites: [
    {
      id: faker.string.uuid(),
      gitToken: faker.string.uuid(),
      gitRepo: faker.internet.url(),
      gitProvider: faker.helpers.arrayElement(['github', 'gitlab', 'bitbucket']),
      gitHost: faker.internet.url(),
    },
  ],
})

export {
  generateSiteRequest,
  generateUserCreateRequest,
  MOCK_ENV,
  fakeAdminToken,
  fakeContributorToken,
  fakeUserAndSiteData,
}
