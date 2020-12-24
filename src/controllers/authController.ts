import { RequestHandler, Response } from 'express'
import { prisma } from '@/prisma'
import { hashPassword, matchPassword, ErrorResponse } from '@/lib'
import { ModelUser } from '@/db.types'
import { createSecureToken } from '@/auth'

interface NewAccountArgs {
  studentNumber: string
  name: string
  birthdate: Date
  email: string
  password: string
}
interface LoginArgs {
  email: string
  password: string
}

const userLogin: RequestHandler = async(req, res, next) => {
  const {
    email,
    password,
  } = req.body as LoginArgs

  if (!email || !password)
    return next(new ErrorResponse('Please provide an email and password', 400))

  const savedUser = await prisma.user.findUnique({
    where: {
      email,
    },
  })
  const isPasswordMatched = matchPassword(password, savedUser.password)

  if (!isPasswordMatched)
    return next(new ErrorResponse('Invalid credentials', 401))

  sendTokenResponse(savedUser, res)
}

const createNewAccount: RequestHandler = async(req, res, next) => {
  const {
    studentNumber,
    name,
    birthdate,
    email,
    password,
  } = req.body as NewAccountArgs

  if (!studentNumber || !name || !birthdate || !email || !password)
    return next(new ErrorResponse('Incorrect data format', 400))

  const user = await prisma.user.create({
    data: {
      studentNumber,
      name,
      birthdate,
      email,
      password,
    },
  })
  sendTokenResponse(user, res)
}

const logout: RequestHandler = async(req, res, next) => {
  res.clearCookie(process.env.AUTH_COOKIE_NAME, { path: '/' })

  res.status(200).json({
    success: true,
    data: {},
  })
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
  logout,
  userLogin,
  createNewAccount,
}
