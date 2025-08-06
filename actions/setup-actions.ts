"use server"

export async function setupDatabase() {
  try {
    const { sql } = await import("@/lib/db")

    console.log("Starting database setup...")

    // Create users table
    console.log("Creating users table...")
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(20),
        date_of_birth DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create user_profile table with quoted column names, user_type, and tools_interest
    console.log("Creating user_profile table...")
    await sql`
      CREATE TABLE IF NOT EXISTS user_profile (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        "user_type" VARCHAR(50),
        "tools_interest" TEXT[],
        "current_role" VARCHAR(200),
        "experience_level" VARCHAR(50),
        "industry" VARCHAR(100),
        "career_goals" TEXT,
        "skills" TEXT[],
        "education_level" VARCHAR(100),
        "location" VARCHAR(200),
        "remote_preference" VARCHAR(50),
        "salary_expectation" INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create onboarding_progress table
    console.log("Creating onboarding_progress table...")
    await sql`
      CREATE TABLE IF NOT EXISTS onboarding_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        current_step INTEGER DEFAULT 1,
        completed_steps INTEGER[] DEFAULT ARRAY[]::INTEGER[],
        is_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create employer_leads table for B2B lead capture
    console.log("Creating employer_leads table...")
    await sql`
      CREATE TABLE IF NOT EXISTS employer_leads (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        company VARCHAR(200),
        job_title VARCHAR(200),
        team_size VARCHAR(50),
        industry VARCHAR(100),
        employer_tools TEXT[],
        user_type VARCHAR(50) DEFAULT 'employer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Drop and recreate AI assessments table with correct column names
    console.log("Creating ai_assessments table with correct column names...")
    await sql`DROP TABLE IF EXISTS ai_assessments CASCADE`
    
    await sql`
      CREATE TABLE ai_assessments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        
        -- Assessment responses matching requirements
        question_1_journey VARCHAR(50),           -- AI journey stage
        question_2_industry VARCHAR(100),         -- Industry
        question_3a_level VARCHAR(50),            -- Experience level
        question_3b_role_title VARCHAR(100),      -- Role/job title
        question_4_knowledge VARCHAR(50),         -- AI knowledge level
        question_5_automation_pct INTEGER,        -- Automation percentage (0-100)
        question_6_superpower VARCHAR(50),        -- Professional superpower
        question_7_learning_style VARCHAR(50),    -- Learning style preference
        question_8_goal VARCHAR(50),              -- Future goal/vision
        
        -- Calculated AI readiness score (0-100)
        ai_readiness_score INTEGER DEFAULT 0,
        
        -- Metadata
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create indexes separately
    console.log("Creating indexes...")
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`
      await sql`CREATE INDEX IF NOT EXISTS idx_user_profile_user_id ON user_profile(user_id)`
      await sql`CREATE INDEX IF NOT EXISTS idx_onboarding_progress_user_id ON onboarding_progress(user_id)`
      await sql`CREATE INDEX IF NOT EXISTS idx_employer_leads_email ON employer_leads(email)`
      await sql`CREATE INDEX IF NOT EXISTS idx_ai_assessments_user_id ON ai_assessments(user_id)`
      await sql`CREATE INDEX IF NOT EXISTS idx_ai_assessments_email ON ai_assessments(email)`
      await sql`CREATE INDEX IF NOT EXISTS idx_ai_assessments_completed_at ON ai_assessments(completed_at)`
      await sql`CREATE INDEX IF NOT EXISTS idx_ai_assessments_score ON ai_assessments(ai_readiness_score)`
    } catch (e) {
      console.log("Some indexes might already exist")
    }

    console.log("Database setup completed successfully!")
    return { success: true, message: "Database tables created successfully with correct column names!" }
  } catch (error) {
    console.error("Error setting up database:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function checkTablesExist() {
  try {
    const { sql } = await import("@/lib/db")

    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'user_profile', 'onboarding_progress', 'employer_leads', 'ai_assessments')
      ORDER BY table_name
    `

    return {
      success: true,
      tables: result.map((row) => row.table_name),
      allTablesExist: result.length === 5,
    }
  } catch (error) {
    console.error("Error checking tables:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function resetDatabase() {
  try {
    const { sql } = await import("@/lib/db")

    console.log("Dropping existing tables...")

    // Drop tables in reverse order due to foreign key constraints
    await sql`DROP TABLE IF EXISTS ai_assessments CASCADE`
    await sql`DROP TABLE IF EXISTS employer_leads CASCADE`
    await sql`DROP TABLE IF EXISTS onboarding_progress CASCADE`
    await sql`DROP TABLE IF EXISTS user_profile CASCADE`
    await sql`DROP TABLE IF EXISTS users CASCADE`

    console.log("Tables dropped successfully!")
    return { success: true, message: "Database reset successfully!" }
  } catch (error) {
    console.error("Error resetting database:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
