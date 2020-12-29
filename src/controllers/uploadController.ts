import { v4 as uuid } from 'uuid'
import { RequestHandler } from 'express'
import { prisma } from '@/prisma'
import { ErrorResponse } from '@/lib'
import { ModelUser } from '@/db.types'
import { BlobServiceClient } from '@azure/storage-blob'

const uploadImage: RequestHandler = async(req, res, next) => {
  const user: ModelUser = (req as any).user

  res.status(200).json({
    success: true,
    user,
  })
}

const getImage: RequestHandler = async(req, res, next) => {
  const user: ModelUser = (req as any).user

  res.status(200).json({
    success: true,
    user,
  })
}

export {
  uploadImage,
  getImage,
}
