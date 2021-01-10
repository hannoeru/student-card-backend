import { ModelUser } from '@/db.types'

declare namespace NodeJS {
  interface ProcessEnv {
    // Additional environment variables
    HASH_KEY: string
    PUBLIC_URL: string
    PORT: string
    AZURE_STORAGE_CONNECTION_STRING: string
    AZURE_STORAGE_CONTAINER_NAME: string
    AZURE_STORAGE_ACCOUNT_NAME: string
  }
}

declare global {
  namespace Express {
    interface User extends ModelUser {}
  }
}
