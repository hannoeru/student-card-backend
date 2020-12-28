import { Router } from 'express'
import { addNewBook } from '@/controllers/bookController'
import { handleSuccessfulLogin, passport } from '@/passport'
import { requireAuth } from '../guards/requireAuth'

const router = Router()

router.post('/book', addNewBook)

export default router
