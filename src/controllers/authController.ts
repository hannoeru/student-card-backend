import { Request, Response, NextFunction } from 'express'
import { prisma } from '@/prisma'
import { hashPassword } from '@/lib'
import { ModelUser } from '@/db.types'
import { createSecureToken } from '@/auth'

interface NewAccountArgs {
  studentNumber: string
  studentName: string
  birthdate: Date
  username: string
  password: string
}

const userLogin = async(req: Request, res: Response, next: NextFunction) => {

}
const createNewAccount = async(req: Request, res: Response, next: NextFunction) => {
  const {
    studentNumber,
    studentName,
    birthdate,
    username,
    password,
  } = req.body as NewAccountArgs

  const hashedPassword = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      studentNumber,
      studentName,
      birthdate,
      username,
      password: hashedPassword,
    },
  })
  sendTokenResponse(user, res)
}

export async function sendTokenResponse(
  user: ModelUser,
  res: Response,
) {
  const authToken = createSecureToken({
    userId: user.id,
  })
  res.cookie(process.env.AUTH_COOKIE_NAME, authToken, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // A year
  })
  res.status(200).json({ success: true, authToken })
}

export {
  userLogin,
  createNewAccount,
}
