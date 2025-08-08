SELECT 'Users created:' as info, COUNT(*) as count FROM users;

SELECT 'User profiles created:' as info, COUNT(*) as count FROM user_profiles;

SELECT 'AI assessments created:' as info, COUNT(*) as count FROM ai_assessments;

SELECT 'User journey stages created:' as info, COUNT(*) as count FROM user_journey_stages;

SELECT 
    u.email,
    up.job_title,
    a.ai_readiness_score,
    ujs.current_stage,
    ujs.stage_1_completed
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN ai_assessments a ON u.id = a.user_id
LEFT JOIN user_journey_stages ujs ON u.id = ujs.user_id
ORDER BY u.id
LIMIT 5;
