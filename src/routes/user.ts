import { Router } from 'express'
import { userData } from '@/controllers/userController'
import { requireAuth } from '../guards/requireAuth'

const router = Router()

router.get('/me', requireAuth, userData)

export default router
