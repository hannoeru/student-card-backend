import { RequestHandler } from 'express'
import { prisma } from '@/prisma'
import { ErrorResponse } from '@/lib'
import { ModelUser } from '@/db.types'
import { ModelUserWithMembers } from '@/guards/requireAuth'

const showMyStudentCard: RequestHandler = async(req, res, next) => {

}

const userData: RequestHandler = async(req, res, next) => {
  const user: ModelUserWithMembers = (req as any).user

  res.status(200).json({
    success: true,
    user,
  })
}

export {
  userData,
  showMyStudentCard,
}
