import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    const result = await sql`
      SELECT ai_readiness_score, created_at
      FROM ai_assessments 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'No assessment found for this user' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      ai_readiness_score: result[0].ai_readiness_score,
      assessment_date: result[0].created_at
    })

  } catch (error) {
    console.error('Error fetching AI readiness score:', error)
    return NextResponse.json(
      { error: 'Failed to fetch AI readiness score' },
      { status: 500 }
    )
  }
}
