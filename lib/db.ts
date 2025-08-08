import { neon } from "@neondatabase/serverless"

// Define the database URL with fallback
const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_IUNQmbw2Yr5O@ep-empty-queen-aen5u557-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

// Initialize the SQL connection
const sql = neon(DATABASE_URL)

export { sql }
