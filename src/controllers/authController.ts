import { Request, Response, NextFunction } from 'express'
import { prisma } from '@/prisma'
import { hashPassword, matchPassword } from '@/lib'
import { ModelUser } from '@/db.types'
import { createSecureToken } from '@/auth'
import { Controller } from '@/controller.types'

interface NewAccountArgs {
  studentNumber: string
  studentName: string
  birthdate: Date
  email: string
  password: string
}
interface LoginArgs {
  email: string
  password: string
}

const userLogin: Controller = async(req, res, next) => {
  const {
    email,
    password,
  } = req.body as LoginArgs

  const savedUser = await prisma.user.findUnique({
    where: {
      email,
    },
  })
  const isPasswordMatched = matchPassword(password, savedUser.password)
  if (isPasswordMatched) {
    sendTokenResponse(savedUser, res)
  }
  else {
    res.status(404).json({
      success: false,
      message: 'ログインできませんでした',
    })
  }
}
const createNewAccount: Controller = async(req, res, next) => {
  const {
    studentNumber,
    studentName,
    birthdate,
    email,
    password,
  } = req.body as NewAccountArgs

  const hashedPassword = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      studentNumber,
      studentName,
      birthdate,
      email,
      password: hashedPassword,
    },
  })
  sendTokenResponse(user, res)
}

const logout = async() => {

}

async function sendTokenResponse(
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
