import { RequestHandler } from 'express'
import { ModelMember, ModelUser } from '@/db.types'
import { prisma } from '@/prisma'
import { ErrorResponse, parseSecureToken } from '@/lib'

export type ModelUserWithMembers = ModelUser & { members: ModelMember[] }

export const requireAuth: RequestHandler = async(req, res, next) => {
  let token
  const authHeader = req.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer'))
    token = authHeader.split(' ')[1]
  else
    token = req.cookies[process.env.AUTH_COOKIE_NAME]

  if (!token)
    return next(new ErrorResponse('Please provide an auth token'))

  const authUser = await parseSecureToken(token)
  if (!authUser)
    return next(new ErrorResponse('Authentication Error'))

  const user: ModelUserWithMembers = await prisma.user.findUnique({
    where: { id: authUser.userId },
    include: {
      members: true,
    },
  })
  if (!user)
    return next(new ErrorResponse('User not found'))

  delete user.password

  req.user = user
  next()
}
