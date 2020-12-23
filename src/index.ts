import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { installPlugins } from '@/plugins'
import { registerRoutes } from '@/routes'
import { passport } from '@/passport'
import { errorHandler } from '@/middleware/errorHandler'
dotenv.config()

const PORT = process.env.PORT || 8000

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan('tiny'))
app.use(express.static('public'))
app.use(passport.initialize())
app.use(passport.session())

installPlugins(app)
registerRoutes(app)

app.get('/ping', async(_req, res) => {
  res.send({
    message: 'pong',
  })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log('Server is running on port', PORT)
})
