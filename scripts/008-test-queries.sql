-- CareerOS Test Data and Verification Queries
-- Run this after the schema fix to populate test data

-- =============================================
-- INSERT TEST USERS
-- =============================================

INSERT INTO users (email, first_name, last_name, created_at) VALUES
('john.doe@example.com', 'John', 'Doe', NOW() - INTERVAL '30 days'),
('jane.smith@example.com', 'Jane', 'Smith', NOW() - INTERVAL '25 days'),
('mike.johnson@example.com', 'Mike', 'Johnson', NOW() - INTERVAL '20 days'),
('sarah.wilson@example.com', 'Sarah', 'Wilson', NOW() - INTERVAL '15 days'),
('david.brown@example.com', 'David', 'Brown', NOW() - INTERVAL '10 days')
ON CONFLICT (email) DO NOTHING;

-- =============================================
-- INSERT TEST USER PROFILES
-- =============================================

INSERT INTO user_profiles (user_id, job_title, industry, career_stage, biggest_challenge, career_goal, created_at)
SELECT 
    u.id,
    CASE 
        WHEN u.email = 'john.doe@example.com' THEN 'Marketing Manager'
        WHEN u.email = 'jane.smith@example.com' THEN 'Software Engineer'
        WHEN u.email = 'mike.johnson@example.com' THEN 'Data Analyst'
        WHEN u.email = 'sarah.wilson@example.com' THEN 'Product Manager'
        WHEN u.email = 'david.brown@example.com' THEN 'UX Designer'
    END,
    CASE 
        WHEN u.email IN ('john.doe@example.com', 'jane.smith@example.com') THEN 'Technology & Software'
        WHEN u.email = 'mike.johnson@example.com' THEN 'Finance & Banking'
        WHEN u.email = 'sarah.wilson@example.com' THEN 'Healthcare & Medical'
        WHEN u.email = 'david.brown@example.com' THEN 'Creative & Design'
    END,
    CASE 
        WHEN u.email IN ('john.doe@example.com', 'sarah.wilson@example.com') THEN 'mid-career'
        WHEN u.email IN ('jane.smith@example.com', 'david.brown@example.com') THEN 'early-career'
        WHEN u.email = 'mike.johnson@example.com' THEN 'senior-career'
    END,
    'Staying current with AI trends',
    'Advance to senior leadership role',
    NOW() - INTERVAL '25 days'
FROM users u
WHERE u.email IN ('john.doe@example.com', 'jane.smith@example.com', 'mike.johnson@example.com', 'sarah.wilson@example.com', 'david.brown@example.com')
ON CONFLICT (user_id) DO NOTHING;

-- =============================================
-- INSERT TEST AI ASSESSMENTS
-- =============================================

INSERT INTO ai_assessments (
    user_id, 
    ai_familiarity, 
    ai_industry_impact, 
    ai_role_integration, 
    ai_understanding_level, 
    ai_work_assistance, 
    ai_superpower, 
    ai_learning_style, 
    ai_vision_success, 
    ai_readiness_score, 
    completed_at,
    created_at
)
SELECT 
    u.id,
    CASE 
        WHEN u.email = 'john.doe@example.com' THEN 'somewhat-familiar'
        WHEN u.email = 'jane.smith@example.com' THEN 'very-familiar'
        WHEN u.email = 'mike.johnson@example.com' THEN 'expert'
        WHEN u.email = 'sarah.wilson@example.com' THEN 'beginner'
        WHEN u.email = 'david.brown@example.com' THEN 'somewhat-familiar'
    END,
    CASE 
        WHEN u.email IN ('john.doe@example.com', 'jane.smith@example.com') THEN 'high-impact'
        WHEN u.email = 'mike.johnson@example.com' THEN 'revolutionary'
        WHEN u.email IN ('sarah.wilson@example.com', 'david.brown@example.com') THEN 'moderate-impact'
    END,
    CASE 
        WHEN u.email IN ('jane.smith@example.com', 'mike.johnson@example.com') THEN 'full-integration'
        WHEN u.email IN ('john.doe@example.com', 'sarah.wilson@example.com') THEN 'partial-integration'
        WHEN u.email = 'david.brown@example.com' THEN 'minimal-integration'
    END,
    CASE 
        WHEN u.email IN ('jane.smith@example.com', 'mike.johnson@example.com') THEN 'advanced'
        WHEN u.email IN ('john.doe@example.com', 'sarah.wilson@example.com') THEN 'intermediate'
        WHEN u.email = 'david.brown@example.com' THEN 'basic'
    END,
    CASE 
        WHEN u.email IN ('jane.smith@example.com', 'mike.johnson@example.com') THEN 'daily-essential'
        WHEN u.email = 'john.doe@example.com' THEN 'weekly-helpful'
        WHEN u.email IN ('sarah.wilson@example.com', 'david.brown@example.com') THEN 'occasional-useful'
    END,
    CASE 
        WHEN u.email = 'john.doe@example.com' THEN 'strategic-thinking'
        WHEN u.email = 'jane.smith@example.com' THEN 'creative-problem-solving'
        WHEN u.email = 'mike.johnson@example.com' THEN 'data-analysis'
        WHEN u.email = 'sarah.wilson@example.com' THEN 'communication'
        WHEN u.email = 'david.brown@example.com' THEN 'creative-problem-solving'
    END,
    CASE 
        WHEN u.email IN ('jane.smith@example.com', 'mike.johnson@example.com') THEN 'hands-on-experimentation'
        WHEN u.email IN ('john.doe@example.com', 'sarah.wilson@example.com') THEN 'structured-courses'
        WHEN u.email = 'david.brown@example.com' THEN 'peer-collaboration'
    END,
    CASE 
        WHEN u.email = 'john.doe@example.com' THEN 'strategic-advisor'
        WHEN u.email = 'jane.smith@example.com' THEN 'ai-specialist'
        WHEN u.email = 'mike.johnson@example.com' THEN 'ai-specialist'
        WHEN u.email = 'sarah.wilson@example.com' THEN 'strategic-advisor'
        WHEN u.email = 'david.brown@example.com' THEN 'enhanced-professional'
    END,
    CASE 
        WHEN u.email = 'john.doe@example.com' THEN 78
        WHEN u.email = 'jane.smith@example.com' THEN 92
        WHEN u.email = 'mike.johnson@example.com' THEN 95
        WHEN u.email = 'sarah.wilson@example.com' THEN 65
        WHEN u.email = 'david.brown@example.com' THEN 71
    END,
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '20 days'
FROM users u
WHERE u.email IN ('john.doe@example.com', 'jane.smith@example.com', 'mike.johnson@example.com', 'sarah.wilson@example.com', 'david.brown@example.com')
ON CONFLICT (user_id) DO NOTHING;

-- =============================================
-- VERIFY DATA WAS INSERTED CORRECTLY
-- =============================================

-- Check users table
SELECT 'Users created:' as info, COUNT(*) as count FROM users;

-- Check user_profiles table
SELECT 'User profiles created:' as info, COUNT(*) as count FROM user_profiles;

-- Check ai_assessments table
SELECT 'AI assessments created:' as info, COUNT(*) as count FROM ai_assessments;

-- Check user_journey_stages table
SELECT 'User journey stages created:' as info, COUNT(*) as count FROM user_journey_stages;

-- Show sample data
SELECT 
    u.email,
    up.job_title,
    up.industry,
    a.ai_readiness_score,
    ujs.current_stage,
    ujs.stage_1_completed
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN ai_assessments a ON u.id = a.user_id
LEFT JOIN user_journey_stages ujs ON u.id = ujs.user_id
ORDER BY u.id
LIMIT 5;
