import { Router } from 'express'
import { userLogin, logout, createNewAccount } from '@/controllers/authController'
import { handleSuccessfulLogin, passport } from '@/passport'
import { requireAuth } from '../guards/requireAuth'

const router = Router()

router.post('/register', createNewAccount)
router.post('/login', userLogin)
router.post('/logout', requireAuth, logout)

router.get('/github',
  passport.authenticate('github', {
    scope: ['email', 'user:profile'],
  }),
)

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }), handleSuccessfulLogin,
)

router.get('/twitter',
  passport.authenticate('twitter'),
)

router.get('/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }), handleSuccessfulLogin,
)

router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
)

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }), handleSuccessfulLogin,
)

export default router
