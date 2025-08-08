import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Check if user_profiles table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles'
      );
    `

    if (!tableExists[0].exists) {
      return NextResponse.json({
        success: false,
        error: 'user_profiles table does not exist',
        table_exists: false
      })
    }

    // Check if job_title column exists and get its details
    const columnInfo = await sql`
      SELECT 
        column_name,
        data_type,
        character_maximum_length,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'user_profiles' 
      AND column_name = 'job_title';
    `

    // Get all columns in user_profiles table for context
    const allColumns = await sql`
      SELECT 
        column_name,
        data_type,
        character_maximum_length,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'user_profiles'
      ORDER BY ordinal_position;
    `

    // Check if index exists
    const indexExists = await sql`
      SELECT EXISTS (
        SELECT FROM pg_indexes 
        WHERE tablename = 'user_profiles' 
        AND indexname = 'idx_user_profiles_job_title'
      );
    `

    const jobTitleExists = columnInfo.length > 0
    const jobTitleColumn = jobTitleExists ? columnInfo[0] : null

    return NextResponse.json({
      success: true,
      table_exists: true,
      job_title_column_exists: jobTitleExists,
      job_title_details: jobTitleColumn ? {
        column_name: jobTitleColumn.column_name,
        data_type: jobTitleColumn.data_type,
        max_length: jobTitleColumn.character_maximum_length,
        is_nullable: jobTitleColumn.is_nullable,
        column_default: jobTitleColumn.column_default
      } : null,
      index_exists: indexExists[0].exists,
      all_columns: allColumns.map(col => ({
        name: col.column_name,
        type: col.data_type,
        max_length: col.character_maximum_length,
        nullable: col.is_nullable
      })),
      verification_status: jobTitleExists && jobTitleColumn.data_type === 'character varying' && jobTitleColumn.character_maximum_length === 200 
        ? 'PERFECT' 
        : jobTitleExists 
        ? 'EXISTS_BUT_WRONG_TYPE' 
        : 'MISSING'
    })

  } catch (error) {
    console.error('Error verifying job_title column:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to verify database schema',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
