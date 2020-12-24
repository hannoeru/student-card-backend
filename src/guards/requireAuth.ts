import { RequestHandler } from 'express'
import { ModelMember, ModelUser } from '@/db.types'
import { prisma } from '@/prisma'
import { ErrorResponse, parseSecureToken } from '@/lib'

export const requireAuth: RequestHandler = async(req, res, next): Promise<void> => {
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

  const user = await prisma.user.findUnique({
    where: { id: authUser.userId },
    include: {
      members: true,
    },
  })
  if (!user)
    return next(new ErrorResponse('User not found'))

  req.user = user
  next()
}
