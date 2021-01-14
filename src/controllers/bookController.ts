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
  } = req.body as AddBookArgs
  const tag = req.body.tags as string
  const user: ModelUser = (req as any).user
  if (!title || !introduction || !imageUrl || !tag)
    return next(new ErrorResponse('Incorrect data format', 400))
  const tags=[]
  let buildTags=[]
  for(let i=0;i<tag.length;i++){
    let book_tag = await prisma.bookTag.findFirst({
      where: {
        name: tag[i],
      },
      select: {
        id:true,
        name:true,
        slug:true,
      }
    })
    if (!book_tag) {
      book_tag = await prisma.bookTag.create({
        data: {
          name: tag[i],
          slug: slug(tag[i]),
        },
        select: {
          id:true,
          name:true,
          slug:true,
        }
      })
    }
    tags.push(book_tag)
    buildTags.push({id:book_tag.id}) 
  }
  const book = await prisma.book.create({
    data: {
      title,
      introduction,
      imageUrl,
      user: {
        connect: {
          id: user.id,
        },
      },
      tags:{
        connect:buildTags
      }
    },
  })
  res.status(200).json({
    title:book.title,
    introduction:book.introduction,
    imageUrl:book.imageUrl,
    tags:tags
  })
}
export {
  addNewBook,
}
