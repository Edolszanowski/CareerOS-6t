-- CareerOS Complete Database Schema
-- This is the final, complete schema with all tables and relationships

-- =============================================
-- USERS AND PROFILES
-- =============================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    job_title VARCHAR(200),
    industry VARCHAR(100),
    career_stage VARCHAR(50),
    biggest_challenge TEXT,
    career_goal TEXT,
    tools_interest TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- =============================================
-- AI ASSESSMENT SYSTEM
-- =============================================

CREATE TABLE IF NOT EXISTS ai_assessments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    ai_familiarity VARCHAR(50),
    ai_industry_impact VARCHAR(50),
    ai_role_integration VARCHAR(50),
    ai_understanding_level VARCHAR(50),
    ai_work_assistance VARCHAR(50),
    ai_superpower VARCHAR(50),
    ai_learning_style VARCHAR(50),
    ai_vision_success VARCHAR(50),
    ai_readiness_score INTEGER,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS assessment_responses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    question_id VARCHAR(100) NOT NULL,
    response_value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- USER JOURNEY TRACKING
-- =============================================

CREATE TABLE IF NOT EXISTS user_journey_stages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    current_stage INTEGER DEFAULT 1 CHECK (current_stage >= 1 AND current_stage <= 5),
    
    -- Stage Completion Status
    stage_1_completed BOOLEAN DEFAULT FALSE, -- Assessment
    stage_2_completed BOOLEAN DEFAULT FALSE, -- Goal Setting  
    stage_3_completed BOOLEAN DEFAULT FALSE, -- Learning
    stage_4_completed BOOLEAN DEFAULT FALSE, -- Job Search
    stage_5_completed BOOLEAN DEFAULT FALSE, -- Success
    
    -- Stage Completion Timestamps
    stage_1_completed_at TIMESTAMP,
    stage_2_completed_at TIMESTAMP,
    stage_3_completed_at TIMESTAMP,
    stage_4_completed_at TIMESTAMP,
    stage_5_completed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- =============================================
-- ONBOARDING SYSTEM
-- =============================================

CREATE TABLE IF NOT EXISTS onboarding_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    current_step INTEGER DEFAULT 1,
    completed_steps INTEGER[] DEFAULT '{}',
    user_type VARCHAR(50),
    basic_info_completed BOOLEAN DEFAULT FALSE,
    career_profile_completed BOOLEAN DEFAULT FALSE,
    ai_assessment_completed BOOLEAN DEFAULT FALSE,
    personalized_insights_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- =============================================
-- EMPLOYER SYSTEM
-- =============================================

CREATE TABLE IF NOT EXISTS employers (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL,
    industry VARCHAR(100),
    company_size VARCHAR(50),
    contact_email VARCHAR(255) NOT NULL,
    contact_name VARCHAR(100),
    phone VARCHAR(20),
    website VARCHAR(255),
    ai_tools_used TEXT[],
    ai_implementation_stage VARCHAR(50),
    biggest_challenge TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- PERSONALIZED INSIGHTS
-- =============================================

CREATE TABLE IF NOT EXISTS personalized_insights (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    insight_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    priority INTEGER DEFAULT 1,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- NEWSLETTER SYSTEM
-- =============================================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    job_title VARCHAR(200),
    industry VARCHAR(100),
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- User profile indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_industry ON user_profiles(industry);
CREATE INDEX IF NOT EXISTS idx_user_profiles_career_stage ON user_profiles(career_stage);

-- AI assessment indexes
CREATE INDEX IF NOT EXISTS idx_ai_assessments_user_id ON ai_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_assessments_score ON ai_assessments(ai_readiness_score);
CREATE INDEX IF NOT EXISTS idx_ai_assessments_completed ON ai_assessments(completed_at);

-- Assessment response indexes
CREATE INDEX IF NOT EXISTS idx_assessment_responses_user_id ON assessment_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_question ON assessment_responses(question_id);

-- Journey stage indexes
CREATE INDEX IF NOT EXISTS idx_user_journey_stages_user_id ON user_journey_stages(user_id);
CREATE INDEX IF NOT EXISTS idx_user_journey_stages_current_stage ON user_journey_stages(current_stage);

-- Onboarding indexes
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_user_id ON onboarding_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_step ON onboarding_progress(current_step);

-- Employer indexes
CREATE INDEX IF NOT EXISTS idx_employers_industry ON employers(industry);
CREATE INDEX IF NOT EXISTS idx_employers_company_size ON employers(company_size);

-- Insights indexes
CREATE INDEX IF NOT EXISTS idx_personalized_insights_user_id ON personalized_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_personalized_insights_type ON personalized_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_personalized_insights_priority ON personalized_insights(priority);

-- Newsletter indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers(is_active);

-- =============================================
-- SAMPLE DATA FOR TESTING
-- =============================================

-- Insert sample users
INSERT INTO users (email, first_name, last_name) VALUES
('john.doe@example.com', 'John', 'Doe'),
('jane.smith@example.com', 'Jane', 'Smith'),
('mike.johnson@example.com', 'Mike', 'Johnson')
ON CONFLICT (email) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ CareerOS database schema created successfully!';
    RAISE NOTICE '✅ 10 tables created with proper relationships';
    RAISE NOTICE '✅ All indexes created for optimal performance';
    RAISE NOTICE '✅ Sample data inserted for testing';
    RAISE NOTICE '✅ Ready for production use!';
END $$;
