import { neon } from "@neondatabase/serverless"

// TEMPORARILY force the correct connection
const DATABASE_URL = "postgresql://neondb_owner:npg_IUNQmbw2Yr5O@ep-empty-queen-aen5u557-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

console.log("🔍 FORCED DATABASE_URL:", DATABASE_URL)

const sql = neon(DATABASE_URL)

export { sql }