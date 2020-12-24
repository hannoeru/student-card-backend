import { RequestHandler } from 'express'
import { prisma } from '@/prisma'
import { ErrorResponse } from '@/lib'

const showMyStudentCard: RequestHandler = async(req, res, next) => {

}

const userData: RequestHandler = async(req, res, next) => {
  const { id } = (req as any).user
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  })

  if (!user)
    return next(new ErrorResponse('User not found', 404))

  delete user.password

  res.status(200).json({
    success: true,
    user,
  })
}

export {
  userData,
  showMyStudentCard,
}
