import { Application } from 'express'
import authRouter from './auth'
import userRouter from './user'

export function registerRoutes(app: Application) {
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/user', userRouter)
}
