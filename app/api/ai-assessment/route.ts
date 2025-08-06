import { NextRequest, NextResponse } from 'next/server'
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Extract all 8 question responses
    const {
      userId,
      question_1_journey,
      question_2_industry,
      question_3a_level,
      question_3b_role_title,
      question_4_knowledge,
      question_5_automation_pct,
      question_6_superpower,
      question_7_learning_style,
      question_8_goal
    } = body

    // Calculate AI Readiness Score
    const score = calculateReadinessScore({
      question_1_journey,
      question_4_knowledge,
      question_5_automation_pct,
      question_7_learning_style
    })

    // Save to database
    const query = `
      INSERT INTO assessment_responses (
        user_id,
        question_1_journey,
        question_2_industry,
        question_3a_level,
        question_3b_role_title,
        question_4_knowledge,
        question_5_automation_pct,
        question_6_superpower,
        question_7_learning_style,
        question_8_goal,
        ai_readiness_score,
        completed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING id, ai_readiness_score
    `

    const values = [
      userId || 1, // Default to user 1 for testing
      question_1_journey,
      question_2_industry,
      question_3a_level,
      question_3b_role_title,
      question_4_knowledge,
      question_5_automation_pct,
      question_6_superpower,
      question_7_learning_style,
      question_8_goal,
      score
    ]

    const result = await pool.query(query, values)

    return NextResponse.json({
      success: true,
      assessmentId: result.rows[0].id,
      aiReadinessScore: result.rows[0].ai_readiness_score,
      message: "Assessment saved successfully!"
    })

  } catch (error) {
    console.error('Assessment save error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save assessment' },
      { status: 500 }
    )
  }
}

// Helper function to calculate score
function calculateReadinessScore(responses: any): number {
  let score = 0
  
  // Journey scoring (max 25)
  const journeyScores: Record<string, number> = {
    'daily': 25,
    'experimenting': 20,
    'curious': 15,
    'behind': 10,
    'new': 5
  }
  score += journeyScores[responses.question_1_journey] || 10
  
  // Knowledge scoring (max 25)
  const knowledgeScores: Record<string, number> = {
    'expert': 25,
    'strategic': 20,
    'basics': 15,
    'lost': 10,
    'zero': 5
  }
  score += knowledgeScores[responses.question_4_knowledge] || 10
  
  // Automation inverse scoring (max 25)
  const automationScore = Math.max(25 - (responses.question_5_automation_pct / 4), 5)
  score += automationScore
  
  // Learning style scoring (max 25)
  const learningScores: Record<string, number> = {
    'dive_in': 25,
    'structured': 20,
    'understand_why': 15,
    'guided': 10,
    'practice': 5
  }
  score += learningScores[responses.question_7_learning_style] || 15
  
  return Math.round(score)
}