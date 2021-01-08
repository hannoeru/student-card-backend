import { Router } from 'express'
import multer from 'multer'
import { userData } from '@/controllers/userController'
import { uploadImage } from '@/controllers/uploadController'
import { requireAuth } from '@/guards/requireAuth'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/image', requireAuth, upload.single('image'), uploadImage)

export default router
