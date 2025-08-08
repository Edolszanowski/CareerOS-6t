-- CareerOS Complete Database Schema Setup
-- Run this script to create the complete database schema

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CORE USER TABLES
-- =============================================

-- Users table - Basic user information
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User profiles - Extended career information
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user_type VARCHAR(50), -- 'professional', 'employer', 'student'
    job_title VARCHAR(200), -- Added for newsletter personalization
    tools_interest TEXT[], -- Array of interested tools
    current_role VARCHAR(100),
    experience_level VARCHAR(50),
    industry VARCHAR(100),
    career_goals TEXT,
    skills TEXT[], -- Array of skills
    education_level VARCHAR(50),
    location VARCHAR(100),
    remote_preference VARCHAR(50),
    salary_expectation INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- AI ASSESSMENT TABLES
-- =============================================

-- AI Assessments - Complete AI readiness assessment results
CREATE TABLE IF NOT EXISTS ai_assessments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    
    -- 8 Assessment Questions (Version 26)
    question_1_journey VARCHAR(100), -- AI journey stage
    question_2_industry VARCHAR(100), -- Industry
    question_3a_level VARCHAR(100), -- Experience level  
    question_3b_role_title VARCHAR(100), -- Role/job title
    question_4_knowledge VARCHAR(100), -- AI knowledge level
    question_5_automation_pct INTEGER CHECK (question_5_automation_pct >= 0 AND question_5_automation_pct <= 100), -- 0-100%
    question_6_superpower VARCHAR(100), -- Professional superpower
    question_7_learning_style VARCHAR(100), -- Learning style
    question_8_goal VARCHAR(100), -- Future vision/goal
    
    -- Calculated Results
    ai_readiness_score INTEGER CHECK (ai_readiness_score >= 0 AND ai_readiness_score <= 100),
    
    -- Timestamps
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- JOURNEY TRACKING TABLES
-- =============================================

-- User Journey Stages - 5-stage career development tracking
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Onboarding Progress - Step-by-step onboarding tracking
CREATE TABLE IF NOT EXISTS onboarding_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    current_step INTEGER DEFAULT 1,
    completed_steps INTEGER[] DEFAULT ARRAY[1], -- Array of completed step numbers
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- CAREER ASSESSMENT TABLES
-- =============================================

-- Career Assessments - Career readiness (separate from AI assessment)
CREATE TABLE IF NOT EXISTS career_assessments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    career_stage VARCHAR(100),
    biggest_challenge VARCHAR(200),
    career_goal VARCHAR(200),
    skills_assessment JSONB, -- Flexible skills data
    career_readiness_score INTEGER CHECK (career_readiness_score >= 0 AND career_readiness_score <= 100),
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessment Responses - Generic assessment analytics table
CREATE TABLE IF NOT EXISTS assessment_responses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    assessment_type VARCHAR(50), -- 'ai_readiness', 'career_readiness', etc.
    question_key VARCHAR(100),
    response_value TEXT,
    response_data JSONB, -- Additional structured data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- EMPLOYER TABLES
-- =============================================

-- Employer Contacts - Employer lead information
CREATE TABLE IF NOT EXISTS employer_contacts (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company_size VARCHAR(50),
    industry VARCHAR(100),
    tools_interest TEXT[], -- Array of tools they're interested in
    message TEXT,
    contact_reason VARCHAR(100), -- 'demo', 'partnership', 'hiring'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- NEWSLETTER & COMMUNICATION TABLES
-- =============================================

-- Newsletter Subscriptions - Newsletter management
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    job_title VARCHAR(200), -- For personalized subject lines
    subscription_type VARCHAR(50) DEFAULT 'weekly', -- 'weekly', 'monthly', 'none'
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- INSIGHTS & RECOMMENDATIONS TABLES
-- =============================================

-- Personalized Insights - AI-generated insights and recommendations
CREATE TABLE IF NOT EXISTS personalized_insights (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    insight_type VARCHAR(50), -- 'career_advice', 'skill_recommendation', 'job_match'
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    recommendations TEXT[], -- Array of actionable recommendations
    priority_level INTEGER DEFAULT 1 CHECK (priority_level >= 1 AND priority_level <= 5),
    is_read BOOLEAN DEFAULT FALSE,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
CREATE INDEX IF NOT EXISTS idx_user_profiles_job_title ON user_profiles(job_title);
CREATE INDEX IF NOT EXISTS idx_user_profiles_experience_level ON user_profiles(experience_level);

-- AI assessment indexes
CREATE INDEX IF NOT EXISTS idx_ai_assessments_user_id ON ai_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_assessments_email ON ai_assessments(email);
CREATE INDEX IF NOT EXISTS idx_ai_assessments_industry ON ai_assessments(question_2_industry);
CREATE INDEX IF NOT EXISTS idx_ai_assessments_score ON ai_assessments(ai_readiness_score);
CREATE INDEX IF NOT EXISTS idx_ai_assessments_completed_at ON ai_assessments(completed_at);

-- Journey tracking indexes
CREATE INDEX IF NOT EXISTS idx_user_journey_stages_user_id ON user_journey_stages(user_id);
CREATE INDEX IF NOT EXISTS idx_user_journey_stages_current_stage ON user_journey_stages(current_stage);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_user_id ON onboarding_progress(user_id);

-- Career assessment indexes
CREATE INDEX IF NOT EXISTS idx_career_assessments_user_id ON career_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_user_id ON assessment_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_type ON assessment_responses(assessment_type);

-- Newsletter indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_user_id ON newsletter_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_active ON newsletter_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_newsletter_industry_job_title ON newsletter_subscriptions(industry, job_title);

-- Insights indexes
CREATE INDEX IF NOT EXISTS idx_personalized_insights_user_id ON personalized_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_personalized_insights_type ON personalized_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_personalized_insights_priority ON personalized_insights(priority_level);

-- Employer contact indexes
CREATE INDEX IF NOT EXISTS idx_employer_contacts_email ON employer_contacts(email);
CREATE INDEX IF NOT EXISTS idx_employer_contacts_industry ON employer_contacts(industry);
CREATE INDEX IF NOT EXISTS idx_employer_contacts_created_at ON employer_contacts(created_at);

-- Schema version tracking
CREATE TABLE IF NOT EXISTS schema_versions (
    id SERIAL PRIMARY KEY,
    version VARCHAR(20) NOT NULL,
    description TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_versions (version, description) 
VALUES ('1.0.0', 'Complete CareerOS database schema with all tables and indexes')
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'CareerOS database schema created successfully!';
    RAISE NOTICE 'Tables created: users, user_profiles, ai_assessments, user_journey_stages, onboarding_progress, career_assessments, assessment_responses, employer_contacts, newsletter_subscriptions, personalized_insights';
    RAISE NOTICE 'Indexes created: 25+ performance indexes';
    RAISE NOTICE 'Ready for CareerOS application!';
END $$;
