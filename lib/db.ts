import { neon } from "@neondatabase/serverless"

// Now it will use your .env.local file properly!
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const sql = neon(process.env.DATABASE_URL)

export { sql }