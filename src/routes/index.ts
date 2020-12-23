import { Express } from 'express'
import authRouter from './auth'
import userRouter from './user'

export function registerRoutes(app: Express) {
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/user', userRouter)
}
