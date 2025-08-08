INSERT INTO users (email, created_at) VALUES
('john.doe@example.com', NOW() - INTERVAL '30 days'),
('jane.smith@example.com', NOW() - INTERVAL '25 days'),
('mike.johnson@example.com', NOW() - INTERVAL '20 days')
ON CONFLICT (email) DO NOTHING;

INSERT INTO user_profiles (user_id, job_title, created_at)
SELECT 
    u.id,
    CASE 
        WHEN u.email = 'john.doe@example.com' THEN 'Marketing Manager'
        WHEN u.email = 'jane.smith@example.com' THEN 'Software Engineer'
        WHEN u.email = 'mike.johnson@example.com' THEN 'Data Analyst'
    END,
    NOW() - INTERVAL '25 days'
FROM users u
WHERE u.email IN ('john.doe@example.com', 'jane.smith@example.com', 'mike.johnson@example.com')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO ai_assessments (user_id, email, ai_familiarity, ai_readiness_score, completed_at, created_at)
SELECT 
    u.id,
    u.email,
    'somewhat-familiar',
    CASE 
        WHEN u.email = 'john.doe@example.com' THEN 78
        WHEN u.email = 'jane.smith@example.com' THEN 92
        WHEN u.email = 'mike.johnson@example.com' THEN 85
    END,
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '20 days'
FROM users u
WHERE u.email IN ('john.doe@example.com', 'jane.smith@example.com', 'mike.johnson@example.com')
ON CONFLICT (user_id) DO NOTHING;
