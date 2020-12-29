import { Router } from 'express'
import { userData } from '@/controllers/userController'
import { createNewStudentCard, getStudentCard } from '@/controllers/cardController'
import { requireAuth } from '../guards/requireAuth'

const router = Router()

router.get('/me', requireAuth, userData)
router.post('/card', requireAuth, createNewStudentCard)
router.get('/card', requireAuth, getStudentCard)

export default router
