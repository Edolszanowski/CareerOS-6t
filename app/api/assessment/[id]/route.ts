import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const assessmentId = params.id

    // Update assessment with user information
    const result = await sql`
      UPDATE ai_assessments 
      SET 
        user_id = ${body.user_id || null},
        email = ${body.email || null},
        first_name = ${body.first_name || null},
        last_name = ${body.last_name || null},
        updated_at = NOW()
      WHERE id = ${assessmentId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      assessment: result[0]
    })

  } catch (error) {
    console.error('Error updating assessment:', error)
    return NextResponse.json(
      { error: 'Failed to update assessment' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = params.id

    const result = await sql`
      SELECT * FROM ai_assessments WHERE id = ${assessmentId}
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      assessment: result[0]
    })

  } catch (error) {
    console.error('Error fetching assessment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessment' },
      { status: 500 }
    )
  }
}
