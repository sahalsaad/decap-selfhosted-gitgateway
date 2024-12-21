import { faker } from '@faker-js/faker'
import { decrypt, encrypt, hashPassword } from '@services/encryption-service'

describe('encryption service', () => {
  describe('encryption', () => {
    it('should encrypt and return encrypted secret', async () => {
      const encryptedSecret = await encrypt(faker.lorem.text(), faker.internet.password())
      expectTypeOf(encryptedSecret).toBeString()
    })
  })

  describe('decryption', () => {
    it('should decrypt and return decrypted secret', async () => {
      const encryptionKey = faker.internet.password()
      const secret = faker.lorem.text()
      const encryptedSecret = await encrypt(secret, encryptionKey)
      const decryptedSecret = await decrypt(encryptedSecret, encryptionKey)
      expectTypeOf(decryptedSecret!).toBeString()
      expect(decryptedSecret).toBe(secret)
    })

    it('should return null if decryption fails', async () => {
      const encryptionKey = faker.internet.password()
      const secret = faker.lorem.text()
      const encryptedSecret = await encrypt(secret, encryptionKey)
      const decryptedSecret = await decrypt(encryptedSecret, faker.internet.password())
      expect(decryptedSecret).toBeNull()
    })
  })

  describe('hashPassword', () => {
    it('should hash password and return hashed password', () => {
      const encryptionKey = faker.internet.password()
      const secret = faker.lorem.text()
      const hashedPassword = hashPassword(secret, encryptionKey)
      expectTypeOf(hashedPassword).toBeString()
      expect(hashedPassword).not.toBe(secret)
    })
  })
})
