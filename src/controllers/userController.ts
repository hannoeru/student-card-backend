import { RequestHandler } from 'express'
import { prisma } from '@/prisma'
import { ErrorResponse } from '@/lib'
import { ModelUser } from '@/db.types'

const showMyStudentCard: RequestHandler = async(req, res, next) => {
  const user: ModelUser = (req as any).user
}

const userData: RequestHandler = async(req, res, next) => {
  const user: ModelUser = (req as any).user

  res.status(200).json({
    success: true,
    user,
  })
}

export {
  userData,
  showMyStudentCard,
}
