import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Calculate AI readiness score based on responses
function calculateAIReadinessScore(responses: any): number {
  let score = 0
  let maxScore = 0

  // AI Journey (0-15 points)
  maxScore += 15
  switch (responses.ai_journey) {
    case 'expert': score += 15; break
    case 'intermediate': score += 10; break
    case 'beginner': score += 5; break
    case 'curious': score += 2; break
    default: score += 0
  }

  // AI Industry (0-10 points)
  maxScore += 10
  switch (responses.ai_industry) {
    case 'leading': score += 10; break
    case 'adopting': score += 7; break
    case 'exploring': score += 4; break
    case 'behind': score += 1; break
    default: score += 0
  }

  // AI Role (0-15 points)
  maxScore += 15
  switch (responses.ai_role) {
    case 'champion': score += 15; break
    case 'implementer': score += 12; break
    case 'learner': score += 8; break
    case 'observer': score += 3; break
    default: score += 0
  }

  // AI Understanding (0-20 points)
  maxScore += 20
  switch (responses.ai_understanding) {
    case 'expert': score += 20; break
    case 'advanced': score += 15; break
    case 'intermediate': score += 10; break
    case 'basic': score += 5; break
    case 'none': score += 0; break
    default: score += 0
  }

  // AI Work Assistance (0-10 points)
  maxScore += 10
  switch (responses.ai_work_assistance) {
    case 'daily': score += 10; break
    case 'weekly': score += 7; break
    case 'monthly': score += 4; break
    case 'rarely': score += 2; break
    case 'never': score += 0; break
    default: score += 0
  }

  // AI Superpower (0-10 points)
  maxScore += 10
  if (responses.ai_superpower) {
    const creativePowers = ['creative-genius', 'innovation-catalyst']
    const analyticalPowers = ['data-wizard', 'efficiency-master']
    const strategicPowers = ['strategic-visionary', 'problem-solver']
    
    if (creativePowers.includes(responses.ai_superpower)) score += 10
    else if (analyticalPowers.includes(responses.ai_superpower)) score += 8
    else if (strategicPowers.includes(responses.ai_superpower)) score += 6
    else score += 4
  }

  // AI Learning Style (0-10 points)
  maxScore += 10
  switch (responses.ai_learning_style) {
    case 'hands-on': score += 10; break
    case 'structured': score += 8; break
    case 'collaborative': score += 6; break
    case 'self-paced': score += 4; break
    default: score += 0
  }

  // AI Vision (0-10 points)
  maxScore += 10
  switch (responses.ai_vision) {
    case 'transformation': score += 10; break
    case 'enhancement': score += 7; break
    case 'automation': score += 5; break
    case 'cautious': score += 2; break
    default: score += 0
  }

  // Convert to percentage and round
  return Math.round((score / maxScore) * 100)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Calculate AI readiness score
    const aiReadinessScore = calculateAIReadinessScore(body)
    
    // Insert assessment without user_id (will be updated later)
    const result = await sql`
      INSERT INTO ai_assessments (
        user_type, tools_interest, ai_journey, ai_industry, ai_role, 
        ai_understanding, ai_work_assistance, ai_superpower, 
        ai_learning_style, ai_vision, ai_readiness_score, created_at
      )
      VALUES (
        ${body.user_type}, ${JSON.stringify(body.tools_interest)}, ${body.ai_journey}, 
        ${body.ai_industry}, ${body.ai_role}, ${body.ai_understanding}, 
        ${body.ai_work_assistance}, ${body.ai_superpower}, ${body.ai_learning_style}, 
        ${body.ai_vision}, ${aiReadinessScore}, NOW()
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      id: result[0].id,
      ai_readiness_score: aiReadinessScore,
      assessment: result[0]
    })

  } catch (error) {
    console.error('Error creating assessment:', error)
    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query
    if (userId) {
      query = sql`
        SELECT * FROM ai_assessments 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `
    } else {
      query = sql`
        SELECT * FROM ai_assessments 
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `
    }

    const result = await query

    return NextResponse.json({
      success: true,
      assessments: result
    })

  } catch (error) {
    console.error('Error fetching assessments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    )
  }
}
