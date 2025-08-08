import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = Number.parseInt(params.userId)

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    // Get user journey data with all related information
    const journeyData = await sql`
      SELECT 
        ujs.*,
        u.email,
        u.name,
        up.job_title,
        up.first_name,
        up.last_name,
        a.ai_readiness_score,
        a.question_1_journey,
        a.question_4_knowledge,
        a.completed_at as assessment_completed_at
      FROM user_journey_stages ujs
      LEFT JOIN users u ON ujs.user_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN ai_assessments a ON u.id = a.user_id
      WHERE ujs.user_id = ${userId}
    `

    if (journeyData.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = journeyData[0]

    // Calculate progress metrics
    const completedStages = [
      user.stage_1_completed,
      user.stage_2_completed,
      user.stage_3_completed,
      user.stage_4_completed,
      user.stage_5_completed,
    ].filter(Boolean).length

    const progressPercentage = Math.round((completedStages / 5) * 100)

    // Define stage information
    const stages = [
      {
        id: 1,
        name: "AI Assessment",
        description: "Complete your AI readiness evaluation",
        completed: user.stage_1_completed || false,
        completedAt: user.stage_1_completed_at,
        current: user.current_stage === 1,
      },
      {
        id: 2,
        name: "Results Review",
        description: "Review your personalized AI readiness results",
        completed: user.stage_2_completed || false,
        completedAt: user.stage_2_completed_at,
        current: user.current_stage === 2,
      },
      {
        id: 3,
        name: "Learning Path",
        description: "Follow your customized AI learning recommendations",
        completed: user.stage_3_completed || false,
        completedAt: user.stage_3_completed_at,
        current: user.current_stage === 3,
      },
      {
        id: 4,
        name: "Skill Building",
        description: "Practice with AI tools and build practical skills",
        completed: user.stage_4_completed || false,
        completedAt: user.stage_4_completed_at,
        current: user.current_stage === 4,
      },
      {
        id: 5,
        name: "AI Integration",
        description: "Successfully integrate AI into your daily workflow",
        completed: user.stage_5_completed || false,
        completedAt: user.stage_5_completed_at,
        current: user.current_stage === 5,
      },
    ]

    const response = {
      success: true,
      data: {
        user: {
          id: user.user_id,
          email: user.email,
          name: user.name,
          jobTitle: user.job_title,
          firstName: user.first_name,
          lastName: user.last_name,
        },
        assessment: {
          completed: !!user.ai_readiness_score,
          score: user.ai_readiness_score,
          journey: user.question_1_journey,
          knowledge: user.question_4_knowledge,
          completedAt: user.assessment_completed_at,
        },
        journey: {
          currentStage: user.current_stage,
          stages,
          completedStages,
          totalStages: 5,
          progressPercentage,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching user journey:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user journey data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = Number.parseInt(params.userId)
    const body = await request.json()

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const { stage, completed } = body

    if (!stage || typeof completed !== "boolean") {
      return NextResponse.json({ error: "Stage and completed status are required" }, { status: 400 })
    }

    // Update the specific stage completion
    const stageColumn = `stage_${stage}_completed`
    const stageTimestampColumn = `stage_${stage}_completed_at`

    await sql`
      UPDATE user_journey_stages 
      SET ${sql(stageColumn)} = ${completed}, 
          ${sql(stageTimestampColumn)} = ${completed ? new Date().toISOString() : null},
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `

    // Update current stage if moving forward
    if (completed && stage < 5) {
      await sql`
        UPDATE user_journey_stages 
        SET current_stage = ${stage + 1}
        WHERE user_id = ${userId} AND current_stage <= ${stage}
      `
    }

    return NextResponse.json({
      success: true,
      message: `Stage ${stage} updated successfully`,
    })
  } catch (error) {
    console.error("Error updating user journey:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update user journey",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
