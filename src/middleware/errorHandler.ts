import { ErrorRequestHandler } from 'express'
import { ErrorResponse } from '@/lib'

const isProd = process.env.NODE_ENV === 'production'
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (!isProd) console.log(err)

  if (err instanceof ErrorResponse) {
    res
      .status(err.statusCode)
      .json({ success: false, error: err.message })
  }
  else {
    res
      .status(500)
      .json({ success: false, error: 'Server Error' })
  }
}
