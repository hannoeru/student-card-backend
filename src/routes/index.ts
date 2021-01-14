import { Express } from 'express'
import authRouter from './auth'
import userRouter from './user'
import uploadRouter from './upload'
import bookRouter from './book'

export function registerRoutes(app: Express) {
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/user', userRouter)
  app.use('/api/v1/books', bookRouter)
  app.use('/api/v1/upload', uploadRouter)
}