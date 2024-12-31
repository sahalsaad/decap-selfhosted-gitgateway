import { settingsRoute } from '@/src/routes/gitgateway/settings'
import { MOCK_ENV, mockAdminPayloadData, mockAdminToken } from '@/vitest/data-helpers'

describe('settings route', () => {
  it('should return 401 if invalid token', async () => {
    const result = await settingsRoute.request(
      '/',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer invalid',
        },
      },
      MOCK_ENV,
    )
    expect(result.status).toBe(401)
  })

  it('should return correct git settings', async () => {
    const result = await settingsRoute.request(
      '/',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${mockAdminToken}`,
        },
      },
      MOCK_ENV,
    )
    expect(result.status).toBe(200)
    expect(await result.json()).toStrictEqual({
      github_enabled: mockAdminPayloadData.git.provider === 'github',
      gitlab_enabled: mockAdminPayloadData.git.provider === 'gitlab',
      bitbucket_enabled: mockAdminPayloadData.git.provider === 'bitbucket',
      roles: null,
    })
  })
})
