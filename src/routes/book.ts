import { Router } from 'express'
import { addNewBook } from '@/controllers/bookController'
import { requireAuth } from '../guards/requireAuth'

const router = Router()

router.post('/', requireAuth, addNewBook)

export default router
