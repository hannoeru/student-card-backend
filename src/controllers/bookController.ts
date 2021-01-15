import { RequestHandler, Response } from 'express'
import { prisma } from '@/prisma'
import { ErrorResponse } from '@/lib'
import slug from 'limax'
import { ModelUser } from '@/db.types'
interface AddBookArgs {
  title: string
  introduction: string
  imageUrl: string
  tags: {
    id: string
    name: string
    slug: string
  }
}
const addNewBook: RequestHandler = async(req, res, next) => {
  const {
    title,
    introduction,
    imageUrl,
    tags,
  } = req.body as AddBookArgs
  const user: ModelUser = (req as any).user
  if (!title || !introduction || !imageUrl || !tags)
    return next(new ErrorResponse('Incorrect data format', 400))
  let tag = await prisma.bookTag.findFirst({
    where: {
      name: tags.name,
    },
  })
  if (!tag) {
    tag = await prisma.bookTag.create({
      data: {
        name: tags.name,
        slug: slug(tags.name),
      },
    })
  }
  prisma.book.create({
    user: {
      connect: {
        id: user.id,
      },
    },
    data: {
      title,
      introduction,
      imageUrl,
    },
    tags: {
      connect: {
        id: tag.id,
      },
    },
  })

  // 最終出力
  res.status(200).json({
    title: '',
    introduction: '',
    imageUrl: '',
    tags: {
      id: '',
      name: '',
      slug: '',
    },
  })
}

export {
  addNewBook,
}
