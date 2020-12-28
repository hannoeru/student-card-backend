import { RequestHandler, Response } from 'express'
import { prisma } from '@/prisma'
import { hashPassword, matchPassword, ErrorResponse, sendTokenResponse } from '@/lib'
import { ModelUser } from '@/db.types'

interface NewAccountArgs {
  name: string
  username: string
  birthdate: Date
  email: string
  password: string
  schoolCode: string
}
interface LoginArgs {
  email?: string
  username?: string
  password: string
}

const userLogin: RequestHandler = async(req, res, next) => {
  const { username, email, password }: LoginArgs = req.body
  let where = {}

  if (!password || (!email && !username))
    return next(new ErrorResponse('Please provide username or email and password', 400))

  if (email)
    where = { email }
  else if (username)
    where = { username }

  const savedUser = await prisma.user.findUnique({
    where,
    select: {
      id: true,
      password: true,
    },
  })

  if (!savedUser)
    return next(new ErrorResponse('Invalid credentials', 401))

  const isPasswordMatched = matchPassword(password, savedUser.password)

  if (!isPasswordMatched)
    return next(new ErrorResponse('Invalid credentials', 401))

  sendTokenResponse(savedUser.id, res)
}

const createNewAccount: RequestHandler = async(req, res, next) => {
  const {
    name,
    username,
    birthdate,
    email,
    password,
    schoolCode,
  } = req.body as NewAccountArgs

  if (!name || !username || !birthdate || !email || !password || !schoolCode)
    return next(new ErrorResponse('Incorrect data format', 400))

  const user = await prisma.user.create({
    data: {
      name,
      username,
      birthdate,
      email,
      password,
      school: {
        connect: {
          code: schoolCode,
        },
      },
    },
  })
  sendTokenResponse(user.id, res)
}

const logout: RequestHandler = async(req, res, next) => {
  res.clearCookie(process.env.AUTH_COOKIE_NAME, { path: '/' })

  res.status(200).json({
    success: true,
    data: {},
  })
}

export {
  logout,
  userLogin,
  createNewAccount,
}
