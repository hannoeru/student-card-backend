import { extname } from 'path'
import { v4 as uuid } from 'uuid'
import { RequestHandler } from 'express'
import { prisma } from '@/prisma'
import { ErrorResponse } from '@/lib'
import { ModelUser } from '@/db.types'
import getStream from 'into-stream'
import { BlobUploadCommonResponse } from '@azure/storage-blob'
import { useAzureBlobStorage } from '@/lib/azureBlobStorage'

const {
  AZURE_STORAGE_ACCOUNT_NAME: azureStorage,
  AZURE_STORAGE_CONTAINER_NAME: azureContainer,
} = process.env

const allowFileTypes = ['image/jpeg', 'image/svg+xml', 'image/webp', 'image/png', 'image/gif']

const checkFileExt = (mimetype: string) => {
  if (allowFileTypes.includes(mimetype))
    return true
  return false
}

const uploadImage: RequestHandler = async(req, res, next) => {
  const user: ModelUser = (req as any).user

  const file = req.file

  let result: BlobUploadCommonResponse
  const stream = getStream(file.buffer)
  const imageId = uuid()
  const blobName = imageId + extname(file.originalname)
  const mimetype = file.mimetype

  if (!checkFileExt(file.mimetype))
    return next(new ErrorResponse('Upload only accept jpeg, png, svg, gif and webp file.', 400))

  try {
    result = await useAzureBlobStorage(stream, blobName, mimetype, user.id)
    console.log(result)
  }
  catch (err) {
    console.log(err)
    return next(new ErrorResponse('Upload failed.', 500))
  }

  const imageUrl = `https://${azureStorage}.blob.core.windows.net/${azureContainer}/${blobName}`

  const image = {
    id: imageId,
    url: imageUrl,
    blobName,
    mimetype,
    updateAt: result.lastModified,
    createAt: result.date,
  }

  res.status(200).json({
    success: true,
    image,
  })
}

export {
  uploadImage,
}
