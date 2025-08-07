import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { sql } = await import("@/lib/db")
    
    // Test basic connection
    const result = await sql`SELECT 1 as test, NOW() as timestamp`
    
    // Get current database name
    const dbName = await sql`SELECT current_database() as database_name`
    
    // Get ALL tables in current database
    const allTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `
    
    // Check for our specific tables
    const ourTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'user_profiles', 'assessment_responses')
      ORDER BY table_name
    `
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      currentDatabase: dbName[0]?.database_name,
      allTables: allTables.map(t => t.table_name),
      ourTables: ourTables.map(t => t.table_name),
      tablesExist: ourTables.length === 3,
      databaseUrl: "Environment variable set"
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}