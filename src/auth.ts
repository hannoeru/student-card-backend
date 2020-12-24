import jwt from 'jsonwebtoken'

export type AuthUser = {
  userId: string
}

export function createSecureToken(payload: AuthUser) {
  const token = jwt.sign(payload, process.env.HASH_KEY)
  return token
}

export async function parseSecureToken(token: string): Promise<AuthUser | null> {
  try {
    return jwt.verify(token, process.env.HASH_KEY) as AuthUser
  } catch (error) {
    console.error('auth error', error)
    return null
  }
}
