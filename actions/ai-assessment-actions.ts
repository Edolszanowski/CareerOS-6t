"use server"

export interface AIAssessmentData {
  question_1_journey: string
  question_2_industry: string
  question_3a_level: string
  question_3b_role_title: string
  question_4_knowledge: string
  question_5_automation_pct: number
  question_6_superpower: string
  question_7_learning_style: string
  question_8_goal: string
  ai_readiness_score?: number
  user_id: number  // INTEGER type
  email: string
}

async function getDbConnection() {
  try {
    const { sql } = await import("@/lib/db")
    return sql
  } catch (error) {
    console.error("Database connection error:", error)
    throw new Error("Database connection failed")
  }
}

export async function saveAIAssessment(assessmentData: AIAssessmentData) {
  try {
    console.log("Saving AI assessment:", assessmentData)

    const sql = await getDbConnection()
    
    // Ensure user_id is INTEGER
    const userId = parseInt(assessmentData.user_id.toString())

    // Check if assessment already exists for this user
    const existingAssessment = await sql`
      SELECT id FROM ai_assessments 
      WHERE user_id = ${userId}
    `

    if (existingAssessment.length > 0) {
      // Update existing assessment
      await sql`
        UPDATE ai_assessments SET
          question_1_journey = ${assessmentData.question_1_journey},
          question_2_industry = ${assessmentData.question_2_industry},
          question_3a_level = ${assessmentData.question_3a_level},
          question_3b_role_title = ${assessmentData.question_3b_role_title},
          question_4_knowledge = ${assessmentData.question_4_knowledge},
          question_5_automation_pct = ${assessmentData.question_5_automation_pct},
          question_6_superpower = ${assessmentData.question_6_superpower},
          question_7_learning_style = ${assessmentData.question_7_learning_style},
          question_8_goal = ${assessmentData.question_8_goal},
          ai_readiness_score = ${assessmentData.ai_readiness_score},
          email = ${assessmentData.email},
          completed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId}
        RETURNING id
      `
      
      return { 
        success: true, 
        message: "Assessment updated successfully",
        ai_readiness_score: assessmentData.ai_readiness_score,
        user_id: userId
      }
    } else {
      // Create new assessment
      const result = await sql`
        INSERT INTO ai_assessments (
          user_id, email, question_1_journey, question_2_industry, 
          question_3a_level, question_3b_role_title, question_4_knowledge,
          question_5_automation_pct, question_6_superpower, question_7_learning_style,
          question_8_goal, ai_readiness_score
        )
        VALUES (
          ${userId}, ${assessmentData.email}, ${assessmentData.question_1_journey}, 
          ${assessmentData.question_2_industry}, ${assessmentData.question_3a_level},
          ${assessmentData.question_3b_role_title}, ${assessmentData.question_4_knowledge},
          ${assessmentData.question_5_automation_pct}, ${assessmentData.question_6_superpower},
          ${assessmentData.question_7_learning_style}, ${assessmentData.question_8_goal},
          ${assessmentData.ai_readiness_score}
        )
        RETURNING id
      `

      return { 
        success: true, 
        message: "Assessment saved successfully",
        assessmentId: result[0].id,
        ai_readiness_score: assessmentData.ai_readiness_score,
        user_id: userId
      }
    }
  } catch (error) {
    console.error("Error saving AI assessment:", error)

    if (error instanceof Error && error.message.includes("relation") && error.message.includes("does not exist")) {
      return { success: false, error: "Database tables not found. Please run the setup script first." }
    }

    return { success: false, error: "Failed to save assessment. Please try again." }
  }
}

export async function getAIAssessment(email: string) {
  try {
    console.log("Retrieving AI assessment for email:", email)

    const sql = await getDbConnection()

    const result = await sql`
      SELECT * FROM ai_assessments 
      WHERE email = ${email}
      ORDER BY completed_at DESC
      LIMIT 1
    `

    if (result.length > 0) {
      return result[0]
    } else {
      return null
    }
  } catch (error) {
    console.error("Error retrieving AI assessment:", error)
    return null
  }
}

export async function getAIAssessmentByUserId(userId: number) {
  try {
    console.log("Retrieving AI assessment for user ID:", userId)

    const sql = await getDbConnection()

    const result = await sql`
      SELECT * FROM ai_assessments 
      WHERE user_id = ${userId}
      ORDER BY completed_at DESC
      LIMIT 1
    `

    if (result.length > 0) {
      return result[0]
    } else {
      return null
    }
  } catch (error) {
    console.error("Error retrieving AI assessment:", error)
    return null
  }
}

export async function subscribeToNewsletters(userId: number, preferences: { role: string; industry: string }) {
  try {
    console.log(`Subscribing user ${userId} to newsletters based on:`, preferences)
    
    // Here you would integrate with your newsletter service
    // For now, we'll just log the subscription
    
    return { 
      success: true, 
      message: `Subscribed to ${preferences.industry} and ${preferences.role} newsletters` 
    }
  } catch (error) {
    console.error("Error subscribing to newsletters:", error)
    return { success: false, error: "Failed to subscribe to newsletters" }
  }
}

export async function completeAssessmentFlow(userId: number) {
  try {
    console.log("Completing assessment flow for user:", userId)
    
    // Redirect to dashboard with user ID
    redirect(`/dashboard/${userId}`)
  } catch (error) {
    console.error("Error completing assessment flow:", error)
    return { success: false, error: "Failed to complete assessment flow" }
  }
}
