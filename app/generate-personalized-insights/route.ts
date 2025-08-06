import { NextRequest, NextResponse } from 'next/server'
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export async function POST(request: NextRequest) {
  try {
    const { assessmentId, userId } = await request.json()
    
    // Fetch assessment data
    const query = `
      SELECT * FROM assessment_responses
      WHERE id = $1 OR user_id = $2
      ORDER BY completed_at DESC
      LIMIT 1
    `
    
    const result = await pool.query(query, [assessmentId, userId])
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Assessment not found' },
        { status: 404 }
      )
    }
    
    const assessment = result.rows[0]
    
    // Generate insights based on responses
    const insights = generateInsights(assessment)
    
    return NextResponse.json({
      success: true,
      insights,
      nextSteps: generateNextSteps(assessment),
      encouragement: generateEncouragement(assessment)
    })
    
  } catch (error) {
    console.error('Insights generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}

function generateInsights(assessment: any) {
  const insights = []
  
  // Journey insight
  if (assessment.question_1_journey === 'new' || assessment.question_1_journey === 'behind') {
    insights.push({
      type: 'opportunity',
      message: "You're at the perfect starting point - 73% of successful AI adopters started exactly where you are",
      priority: 'high'
    })
  }
  
  // Automation insight
  if (assessment.question_5_automation_pct > 60) {
    insights.push({
      type: 'action',
      message: `With ${assessment.question_5_automation_pct}% automation potential, focusing on your ${assessment.question_6_superpower} superpower becomes critical`,
      priority: 'high'
    })
  }
  
  // Industry insight
  insights.push({
    type: 'comparison',
    message: `${assessment.question_2_industry} professionals who embrace AI early see 2.3x faster career growth`,
    priority: 'medium'
  })
  
  return insights
}

function generateNextSteps(assessment: any) {
  const steps = []
  
  // Based on journey level
  if (assessment.question_1_journey === 'new') {
    steps.push({
      title: "Your First AI Conversation",
      description: "Start with ChatGPT or Claude - ask it to help with one work task",
      timeInvestment: "15 minutes",
      impact: "high"
    })
  }
  
  // Based on learning style
  if (assessment.question_7_learning_style === 'structured') {
    steps.push({
      title: "Structured AI Learning Path",
      description: "Follow our step-by-step modules designed for systematic learners",
      timeInvestment: "30 minutes/day",
      impact: "high"
    })
  }
  
  // Based on goal
  if (assessment.question_8_goal === 'leading') {
    steps.push({
      title: "AI Leadership Primer",
      description: "Understand AI strategy and transformation for leaders",
      timeInvestment: "1 hour",
      impact: "critical"
    })
  }
  
  return steps
}

function generateEncouragement(assessment: any) {
  const score = assessment.ai_readiness_score
  
  if (score >= 75) {
    return "You're in the top 25% of AI-ready professionals! Your combination of knowledge and approach positions you perfectly for the AI era."
  } else if (score >= 50) {
    return "You're ahead of the curve! With focused learning in key areas, you'll quickly move into AI leadership."
  } else if (score >= 25) {
    return "You're exactly where many successful AI adopters started. Your growth potential is enormous!"
  } else {
    return "Starting fresh gives you the advantage of learning the right way from the beginning. You've got this!"
  }
}