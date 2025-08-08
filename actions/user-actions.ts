"use server"

import { redirect } from "next/navigation"

export interface UserData {
  email: string
  firstName: string
  lastName: string
  jobTitle?: string
  phone?: string
  dateOfBirth?: string
}

export interface ProfileData {
  userType?: string
  jobTitle?: string
  toolsInterest?: string[]
  currentRole?: string
  experienceLevel?: string
  industry?: string
  careerGoals?: string
  skills?: string[]
  educationLevel?: string
  location?: string
  remotePreference?: string
  salaryExpectation?: number
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

export async function createUser(userData: UserData) {
  try {
    console.log("Creating user with data:", userData)

    const sql = await getDbConnection()

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${userData.email}
    `

    if (existingUser.length > 0) {
      return { success: false, error: "User with this email already exists" }
    }

    const result = await sql`
      INSERT INTO users (email, first_name, last_name, phone, date_of_birth)
      VALUES (${userData.email}, ${userData.firstName}, ${userData.lastName}, 
              ${userData.phone || null}, ${userData.dateOfBirth || null})
      RETURNING id
    `

    const userId = result[0].id
    console.log("Created user with ID:", userId)

    // Initialize onboarding progress
    await sql`
      INSERT INTO onboarding_progress (user_id, current_step, completed_steps)
      VALUES (${userId}, 1, ARRAY[1])
    `

    // Create initial user profile with job title if provided
    if (userData.jobTitle) {
      await sql`
        INSERT INTO user_profiles (user_id, job_title)
        VALUES (${userId}, ${userData.jobTitle})
      `
    }

    return { success: true, userId }
  } catch (error) {
    console.error("Error creating user:", error)

    // Check if it's a table doesn't exist error
    if (error instanceof Error && error.message.includes("relation") && error.message.includes("does not exist")) {
      return { success: false, error: "Database tables not found. Please run the setup script first." }
    }

    return { success: false, error: "Failed to create user account. Please try again." }
  }
}

export async function updateUserProfile(userId: number, profileData: ProfileData) {
  try {
    console.log("Updating profile for user:", userId, "with data:", profileData)

    const sql = await getDbConnection()

    // First check if profile exists
    const existingProfile = await sql`
      SELECT id FROM user_profiles WHERE user_id = ${userId}
    `

    if (existingProfile.length > 0) {
      // Update existing profile
      await sql`
        UPDATE user_profiles SET
          "user_type" = ${profileData.userType || null},
          "job_title" = ${profileData.jobTitle || null},
          "tools_interest" = ${profileData.toolsInterest || []},
          "current_role" = ${profileData.currentRole || null},
          "experience_level" = ${profileData.experienceLevel || null},
          "industry" = ${profileData.industry || null},
          "career_goals" = ${profileData.careerGoals || null},
          "skills" = ${profileData.skills || []},
          "education_level" = ${profileData.educationLevel || null},
          "location" = ${profileData.location || null},
          "remote_preference" = ${profileData.remotePreference || null},
          "salary_expectation" = ${profileData.salaryExpectation || null},
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId}
      `
    } else {
      // Insert new profile
      await sql`
        INSERT INTO user_profiles (
          user_id, "user_type", "job_title", "tools_interest", "current_role", "experience_level", "industry", "career_goals",
          "skills", "education_level", "location", "remote_preference", "salary_expectation"
        )
        VALUES (
          ${userId}, ${profileData.userType || null}, ${profileData.jobTitle || null}, ${profileData.toolsInterest || []}, 
          ${profileData.currentRole || null}, ${profileData.experienceLevel || null}, 
          ${profileData.industry || null}, ${profileData.careerGoals || null}, 
          ${profileData.skills || []}, ${profileData.educationLevel || null}, 
          ${profileData.location || null}, ${profileData.remotePreference || null}, 
          ${profileData.salaryExpectation || null}
        )
      `
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: "Failed to update profile. Please try again." }
  }
}

export async function updateOnboardingProgress(userId: number, step: number) {
  try {
    console.log("Updating progress for user:", userId, "to step:", step)

    const sql = await getDbConnection()

    await sql`
      UPDATE onboarding_progress 
      SET current_step = ${step},
          completed_steps = array_append(completed_steps, ${step}),
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `

    return { success: true }
  } catch (error) {
    console.error("Error updating progress:", error)
    return { success: false, error: "Failed to update progress" }
  }
}

export async function completeOnboarding(userId: number) {
  try {
    console.log("Completing onboarding for user:", userId)

    const sql = await getDbConnection()

    await sql`
      UPDATE onboarding_progress 
      SET is_completed = TRUE,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `

    redirect("/dashboard")
  } catch (error) {
    console.error("Error completing onboarding:", error)
    return { success: false, error: "Failed to complete onboarding" }
  }
}

export async function getUserData(userId: number) {
  try {
    const sql = await getDbConnection()

    const userData = await sql`
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.date_of_birth,
        u.created_at,
        p."user_type",
        p."job_title",
        p."tools_interest",
        p."current_role",
        p."experience_level",
        p."industry",
        p."career_goals",
        p."skills",
        p."education_level",
        p."location",
        p."remote_preference",
        p."salary_expectation",
        op.current_step,
        op.completed_steps,
        op.is_completed
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      LEFT JOIN onboarding_progress op ON u.id = op.user_id
      WHERE u.id = ${userId}
    `

    return userData[0] || null
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}
