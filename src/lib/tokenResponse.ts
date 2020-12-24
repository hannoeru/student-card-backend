import { Response } from 'express'
import { createSecureToken } from '@/auth'

export async function sendTokenResponse(
  userId: string,
  res: Response,
) {
  const authToken = createSecureToken({ userId })
  res.cookie(process.env.AUTH_COOKIE_NAME, authToken, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // A year
  })
  res.status(200).json({ success: true, authToken })
}
