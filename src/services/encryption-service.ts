import crypto from 'node:crypto'
import { TextEncoder } from 'node:util'

const encrypt = async (secret: string, encryptKey: string): Promise<string> => {
  const enc = new TextEncoder()
  const pwUtf8 = enc.encode(encryptKey)

  const baseKey = await crypto.subtle.importKey(
    'raw', // raw key data
    pwUtf8, // the password
    'PBKDF2', // algorithm
    false, // extractable
    ['deriveKey'] // key usages
  )

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey, // The crucial change: use the imported baseKey
    { name: 'AES-GCM', length: 256 },
    false, // extractable
    ['encrypt', 'decrypt']
  )

  const messageUtf8 = enc.encode(secret)
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, messageUtf8)

  const secretData: SecretData = {
    ciphertext: String.fromCharCode(...new Uint8Array(ciphertext)),
    iv: String.fromCharCode(...iv),
    salt: String.fromCharCode(...salt),
  }

  return btoa(JSON.stringify(secretData))
}

const decrypt = async (encryptedSecret: string, encryptKey: string): Promise<string | null> => {
  const encryptedData: SecretData = JSON.parse(atob(encryptedSecret))
  const enc = new TextEncoder()
  const pwUtf8 = enc.encode(encryptKey)

  const baseKey = await crypto.subtle.importKey('raw', pwUtf8, 'PBKDF2', false, ['deriveKey'])

  const salt = Uint8Array.from(encryptedData.salt, (c) => c.charCodeAt(0))
  const iv = Uint8Array.from(encryptedData.iv, (c) => c.charCodeAt(0))
  const ciphertext = Uint8Array.from(encryptedData.ciphertext, (c) => c.charCodeAt(0))

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey, // Use the imported baseKey
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )

  try {
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, ciphertext)
    return new TextDecoder().decode(decrypted)
  } catch {
    return null
  }
}

const hashPassword = (password: string, secretKey: string): string => {
  const secretKeyUint8Array = new TextEncoder().encode(secretKey)
  const hmac = crypto.createHmac('sha256', secretKeyUint8Array)
  hmac.update(password)
  return hmac.digest('hex')
}

export { encrypt, decrypt, hashPassword }
