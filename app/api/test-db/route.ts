import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Import the database connection dynamically
    const { sql } = await import("@/lib/db")

    // Test basic connection
    const result = await sql`SELECT 1 as test, NOW() as timestamp`

    // Test if our tables exist
    const tablesCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'user_profile', 'onboarding_progress')
      ORDER BY table_name
    `

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      connection: result[0],
      tables: tablesCheck.map((t) => t.table_name),
      tablesExist: tablesCheck.length === 3,
      databaseUrl: process.env.DATABASE_URL ? "Environment variable set" : "Using fallback URL",
    })
  } catch (error) {
    console.error("Database connection error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown database error",
        databaseUrl: process.env.DATABASE_URL ? "Environment variable set" : "Using fallback URL",
      },
      { status: 500 },
    )
  }
}
