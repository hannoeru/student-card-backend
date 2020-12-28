import { RequestHandler } from 'express'
import { prisma } from '@/prisma'
import { ErrorResponse } from '@/lib'
import { ModelUser } from '@/db.types'

interface NewStudentCardArgs {
  studentNumber: string
  department: string
}

const createNewStudentCard: RequestHandler = async(req, res, next) => {
  const {
    studentNumber,
    department,
  } = req.body as NewStudentCardArgs

  if (!studentNumber || !department)
    return next(new ErrorResponse('Incorrect data format', 400))

  const user: ModelUser = (req as any).user

  if (!user.schoolId)
    return next(new ErrorResponse('please join one school before create a student card.', 400))

  const card = await prisma.studentIDCard.create({
    data: {
      name: user.name,
      studentNumber,
      department,
      user: {
        connect: {
          id: user.id,
        },
      },
      school: {
        connect: {
          id: user.schoolId,
        },
      },
    },
    include: {
      user: true,
      school: true,
    },
  })

  res.status(200).json({
    success: true,
    card,
  })
}

const getStudentCard: RequestHandler = async(req, res, next) => {
  const user: ModelUser = (req as any).user

  if (!user.schoolId)
    return next(new ErrorResponse('please join one school first.', 400))

  const card = await prisma.studentIDCard.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      user: true,
      school: true,
    },
  })

  if (!card.approved)
    return next(new ErrorResponse('Your student ID card has not yet been approved.', 403))

  res.status(200).json({
    success: true,
    card,
  })
}

export {
  createNewStudentCard,
  getStudentCard,
}
