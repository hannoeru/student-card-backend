import { ErrorRequestHandler } from 'express'
import { ErrorResponse } from '@/lib'
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
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
