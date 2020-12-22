import { Request, Response, NextFunction } from 'express'
import { parseSecureToken } from '@/auth'
import { ModelMember, ModelUser } from '@/db.types'
import { prisma } from '@/prisma'
import { ErrorResponse } from '../lib'

export type ModelUserWithMembers = ModelUser & { members: ModelMember[] }

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies[process.env.AUTH_COOKIE_NAME]
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
