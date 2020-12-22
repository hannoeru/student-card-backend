import { Request, Response, NextFunction } from 'express'
import { ErrorResponse } from '@/lib'
export function errorHandler(
  err: ErrorResponse | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ErrorResponse) {
    res
      .status(err.statusCode)
      .json({ success: false, error: err.message })
  }
  if (err instanceof Error) {
    res
      .status(500)
      .json({ success: false, error: 'Server Error' })
  }
}
