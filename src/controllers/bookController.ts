import { RequestHandler, Response } from 'express'
import { prisma } from '@/prisma'
import { hashPassword, matchPassword, ErrorResponse, sendTokenResponse } from '@/lib'

interface AddBookArgs {
  title: string
  introduction: string
  imageUrl: string
}
interface BookTagArgs {
  studentNumber: string
  name: string
}

const addNewBook: RequestHandler = async(req, res, next) => {
  const {
    title,
    introduction,
    imageUrl,
  } = req.body as AddBookArgs
  const tags = req.body as BookTagArgs　//これでいいのか？

  if (!title || !introduction || !imageUrl)
    return next(new ErrorResponse('Incorrect data format', 400))
  //tagがある確認して無ければ追加したい
  const tag = await prisma.bookTag.create({　//.create等のドキュメントが見当たらないので良くわからない
    where:{

    },
    data:{
      
    },
  })
  //追加とか終わったら書き込みたい
  const book = await prisma.book.create({
    user:{
      connect:{//連携？
        //ユーザーid
      },
    },
    data: {//data:の意味***:はどう定義されているのか
      title,
      introduction,
      imageUrl,
    },
    tags:{
      connect:{
        tags,
      },
    },
  })
}

export {
  addNewBook,
}
