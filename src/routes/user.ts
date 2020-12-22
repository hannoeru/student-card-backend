import { Router } from 'express'
import { requireAuth } from '../guards/requireAuth'

const router = Router()

router.use('/me', requireAuth, (req, res, next) => {
  res.json({
    message: 'protected',
  })
})

export default router
