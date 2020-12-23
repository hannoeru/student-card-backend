import { Express } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import hpp from 'hpp'

export function installPlugins(app: Express) {
  // Set security headers
  app.use(helmet())

  // Prevent http param pollution
  app.use(hpp())

  // Enable CORS
  app.use(cors())
}
