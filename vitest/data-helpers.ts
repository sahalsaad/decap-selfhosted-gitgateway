import { faker } from '@faker-js/faker'
import { env } from 'cloudflare:test'
import { sign } from 'hono/jwt'

import type { UserCreateRequest } from '@/types/user'

import { hashPassword } from '@services/encryption-service'

function generateSiteRequest() {
  return {
    cmsUrl: faker.internet.url(),
    gitToken: faker.string.uuid(),
    gitRepo: faker.internet.url(),
    gitProvider: faker.helpers.arrayElement(['github', 'gitlab', 'bitbucket']),
    gitHost: faker.internet.url(),
  }
}

function generateUserCreateRequest(): UserCreateRequest {
  return {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password(),
    role: faker.helpers.arrayElement(['admin', 'contributor']),
  }
}

const MOCK_ENV = {
  DB: env.DB,
  AUTH_SECRET_KEY: faker.string.uuid(),
}

const mockAdminPayloadData = {
  user: {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    role: 'admin',
  },
  git: {
    token: faker.string.uuid(),
    provider: faker.helpers.arrayElement(['github', 'gitlab', 'bitbucket']),
    host: faker.internet.url(),
    repo: faker.internet.url(),
  },
}

const mockAdminToken = await sign(mockAdminPayloadData, MOCK_ENV.AUTH_SECRET_KEY)

const mockContributorPayloadData = {
  user: {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    role: 'contributor',
  },
  git: {
    token: faker.string.uuid(),
    provider: faker.helpers.arrayElement(['github', 'gitlab', 'bitbucket']),
    host: faker.internet.url(),
    repo: faker.internet.url(),
  },
}

const mockContributorToken = await sign(mockContributorPayloadData, MOCK_ENV.AUTH_SECRET_KEY)

function mockUserAndSiteData(password: string) {
  return {
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
  }
}

export {
  generateSiteRequest,
  generateUserCreateRequest,
  MOCK_ENV,
  mockAdminPayloadData,
  mockAdminToken,
  mockContributorPayloadData,
  mockContributorToken,
  mockUserAndSiteData,
}
