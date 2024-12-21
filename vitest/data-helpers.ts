import { faker } from '@faker-js/faker'
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

export { generateSiteRequest, generateUserCreateRequest }
