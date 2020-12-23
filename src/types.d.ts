declare namespace NodeJS {
  interface ProcessEnv {
    // Additional environment variables
    HASH_KEY: string
    PUBLIC_URL: string
    PORT: string
  }
}
