INSERT INTO users (email, created_at) VALUES
('sarah.wilson@example.com', NOW() - INTERVAL '15 days'),
('david.brown@example.com', NOW() - INTERVAL '10 days')
ON CONFLICT (email) DO NOTHING;

INSERT INTO user_profiles (user_id, job_title, created_at)
SELECT 
    u.id,
    CASE 
        WHEN u.email = 'sarah.wilson@example.com' THEN 'Product Manager'
        WHEN u.email = 'david.brown@example.com' THEN 'UX Designer'
    END,
    NOW() - INTERVAL '12 days'
FROM users u
WHERE u.email IN ('sarah.wilson@example.com', 'david.brown@example.com')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO ai_assessments (
    user_id, 
    email,
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
    u.email,
    CASE 
        WHEN u.email = 'sarah.wilson@example.com' THEN 'beginner'
        WHEN u.email = 'david.brown@example.com' THEN 'somewhat-familiar'
    END,
    'moderate-impact',
    CASE 
        WHEN u.email = 'sarah.wilson@example.com' THEN 'partial-integration'
        WHEN u.email = 'david.brown@example.com' THEN 'minimal-integration'
    END,
    CASE 
        WHEN u.email = 'sarah.wilson@example.com' THEN 'intermediate'
        WHEN u.email = 'david.brown@example.com' THEN 'basic'
    END,
    'occasional-useful',
    CASE 
        WHEN u.email = 'sarah.wilson@example.com' THEN 'communication'
        WHEN u.email = 'david.brown@example.com' THEN 'creative-problem-solving'
    END,
    CASE 
        WHEN u.email = 'sarah.wilson@example.com' THEN 'structured-courses'
        WHEN u.email = 'david.brown@example.com' THEN 'peer-collaboration'
    END,
    CASE 
        WHEN u.email = 'sarah.wilson@example.com' THEN 'strategic-advisor'
        WHEN u.email = 'david.brown@example.com' THEN 'enhanced-professional'
    END,
    CASE 
        WHEN u.email = 'sarah.wilson@example.com' THEN 65
        WHEN u.email = 'david.brown@example.com' THEN 71
    END,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
FROM users u
WHERE u.email IN ('sarah.wilson@example.com', 'david.brown@example.com')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO user_journey_stages (user_id, current_stage, stage_1_completed, stage_1_completed_at)
SELECT 
    u.id,
    2,
    TRUE,
    NOW() - INTERVAL '10 days'
FROM users u
WHERE u.email IN ('sarah.wilson@example.com', 'david.brown@example.com')
AND NOT EXISTS (
    SELECT 1 FROM user_journey_stages ujs WHERE ujs.user_id = u.id
);
