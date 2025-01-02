import { faker } from '@faker-js/faker'

import updatePasswordRoute from '@/src/routes/api/client/update-password'
import { MOCK_ENV, mockAdminToken } from '@/vitest/data-helpers'
import { hashPassword } from '@services/encryption-service'

const mockUserService = {
  getUserByEmail: vi.fn(),
  setPassword: vi.fn(),
}

vi.mock('@services/user-service', () => ({
  UserService: vi.fn().mockImplementation(() => mockUserService),
}))

describe('update password', () => {
  it('should return user not found if wrong email', async () => {
    mockUserService.getUserByEmail.mockResolvedValue(undefined)

    const response = await updatePasswordRoute.request(
      '/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mockAdminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: faker.internet.email(),
          currentPassword: faker.internet.password(),
          newPassword: faker.internet.password(),
        }),
      },
      MOCK_ENV,
    )
    expect(await response.text()).toMatchSnapshot()
  })

  it('should return incorrect password if invalid existing password', async () => {
    mockUserService.getUserByEmail.mockResolvedValue({
      id: faker.string.uuid(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: faker.helpers.arrayElement(['admin', 'contributor']),
      password: hashPassword(faker.internet.password(), MOCK_ENV.AUTH_SECRET_KEY!),
    })

    const response = await updatePasswordRoute.request(
      '/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mockAdminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: faker.internet.email(),
          currentPassword: faker.internet.password(),
          newPassword: faker.internet.password(),
        }),
      },
      MOCK_ENV,
    )
    expect(await response.text()).toMatchSnapshot()
  })

  it('should return errors if wrong request payload', async () => {
    const response = await updatePasswordRoute.request(
      '/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mockAdminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      },
      MOCK_ENV,
    )
    expect(await response.text()).toMatchSnapshot()
  })

  it('should return success if password updated', async () => {
    const password = faker.internet.password()
    mockUserService.getUserByEmail.mockResolvedValue({
      id: faker.string.uuid(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: faker.helpers.arrayElement(['admin', 'contributor']),
      password: hashPassword(password, MOCK_ENV.AUTH_SECRET_KEY!),
    })
    mockUserService.setPassword.mockResolvedValue(true)

    const response = await updatePasswordRoute.request(
      '/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mockAdminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: faker.internet.email(),
          currentPassword: password,
          newPassword: faker.internet.password(),
        }),
      },
      MOCK_ENV,
    )
    expect(await response.text()).toMatchSnapshot()
  })
})
