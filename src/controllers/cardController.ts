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

  const exist = prisma.studentIDCard.findFirst({
    where: {
      userId: user.id,
    },
  })

  if (exist)
    return next(new ErrorResponse('Student ID card is already created', 400))

  const card = await prisma.studentIDCard.create({
    data: {
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
  })

  res.status(200).json({
    success: true,
    message: 'Please wait teachers to approve this student ID card',
  })
}

const getStudentCard: RequestHandler = async(req, res, next) => {
  const user: ModelUser = (req as any).user

  if (!user.schoolId)
    return next(new ErrorResponse('please join one school first.', 400))

  const result = await prisma.studentIDCard.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      user: {
        select: {
          name: true,
          birthdate: true,
        },
      },
      school: {
        select: {
          name: true,
          code: true,
          address: true,
          phone: true,
          logo: true,
          headOfSchool: true,
        },
      },
    },
  })

  if (!result.approved)
    return next(new ErrorResponse('Your student ID card has not yet been approved.', 403))

  res.status(200).json({
    success: true,
    card: {
      issue_date: result.updatedAt,
      student: {
        name: result.user.name,
        number: result.studentNumber,
        department: result.department,
        birthdate: result.user.birthdate,
      },
      school: result.school,
    },
  })
}

export {
  createNewStudentCard,
  getStudentCard,
}
