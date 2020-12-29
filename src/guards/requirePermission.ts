import { RequestHandler } from 'express'
import { ModelUser } from '@/db.types'
import { prisma } from '@/prisma'
import { ErrorResponse, parseSecureToken } from '@/lib'

export const requirePermission = (...roles): RequestHandler => async(req, res, next): Promise<void> => {
  const user: ModelUser = (req as any).user

  if (!roles.includes(user.role)) {
    return next(
      new ErrorResponse(
        `User role ${user.role} is not authorized to access this route`,
        403,
      ),
    )
  }
  next()
}
