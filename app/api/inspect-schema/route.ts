import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { sql } = await import("@/lib/db")

    // Get detailed schema information for all tables
    const schemaInfo = await sql`
      SELECT 
        t.table_name,
        json_agg(
          json_build_object(
            'column_name', c.column_name,
            'data_type', c.data_type,
            'is_nullable', c.is_nullable,
            'column_default', c.column_default,
            'character_maximum_length', c.character_maximum_length,
            'numeric_precision', c.numeric_precision,
            'numeric_scale', c.numeric_scale,
            'ordinal_position', c.ordinal_position
          ) ORDER BY c.ordinal_position
        ) as columns
      FROM information_schema.tables t
      LEFT JOIN information_schema.columns c ON t.table_name = c.table_name
      WHERE t.table_schema = 'public' 
      AND t.table_type = 'BASE TABLE'
      GROUP BY t.table_name
      ORDER BY t.table_name
    `

    // Get foreign key constraints
    const foreignKeys = await sql`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        tc.constraint_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
    `

    // Get indexes
    const indexes = await sql`
      SELECT
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `

    return NextResponse.json({
      success: true,
      message: "Schema inspection completed",
      schema: schemaInfo,
      foreignKeys: foreignKeys,
      indexes: indexes,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("Schema inspection error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown schema inspection error",
      },
      { status: 500 }
    )
  }
}
