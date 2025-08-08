import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(request: NextRequest) {
  try {
    const { assessmentData, aiReadinessScore } = await request.json()

    const prompt = `
    Based on this AI readiness assessment data, generate personalized insights:
    
    AI Readiness Score: ${aiReadinessScore}/100
    Journey Stage: ${assessmentData.question_1_journey}
    Industry: ${assessmentData.question_2_industry}
    Role Level: ${assessmentData.question_3a_level}
    Role Title: ${assessmentData.question_3b_role_title}
    AI Knowledge: ${assessmentData.question_4_knowledge}
    Automation Percentage: ${assessmentData.question_5_automation_pct}%
    Superpower: ${assessmentData.question_6_superpower}
    Learning Style: ${assessmentData.question_7_learning_style}
    Vision/Goal: ${assessmentData.question_8_goal}

    Generate a JSON response with:
    {
      "insights": {
        "strengths": ["strength1", "strength2", "strength3"],
        "recommendations": ["rec1", "rec2", "rec3"],
        "nextSteps": ["step1", "step2", "step3"],
        "learningPath": ["path1", "path2", "path3"]
      }
    }

    Make it personalized, actionable, and encouraging. Focus on their specific industry and role.
    `

    const { text } = await generateText({
      model: openai('gpt-4o'),
      prompt,
      temperature: 0.7,
    })

    let insights
    try {
      insights = JSON.parse(text)
    } catch (parseError) {
      // Fallback insights if AI response isn't valid JSON
      insights = {
        insights: {
          strengths: [
            "Willingness to learn and adapt",
            "Recognition of AI's importance",
            "Unique perspective and experience"
          ],
          recommendations: [
            "Start with beginner-friendly AI tools",
            "Focus on practical applications in your field",
            "Connect with AI learning communities"
          ],
          nextSteps: [
            "Try one AI tool this week",
            "Take an online AI course",
            "Set aside time for AI exploration"
          ],
          learningPath: [
            "AI fundamentals and terminology",
            "Industry-specific AI applications",
            "Hands-on tool practice"
          ]
        }
      }
    }

    return NextResponse.json({
      success: true,
      insights: insights.insights
    })

  } catch (error) {
    console.error('Error generating insights:', error)
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}
