SELECT '=== CAREEROS DATABASE COMPREHENSIVE TEST ===' as test_header;

SELECT '1. TABLE EXISTENCE CHECK' as test_section;
SELECT 
    'Table Existence' as test_name,
    table_name,
    CASE WHEN table_name IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'user_profiles', 'ai_assessments', 'user_journey_stages')
ORDER BY table_name;

SELECT '2. RECORD COUNT VERIFICATION' as test_section;
SELECT 'users' as table_name, COUNT(*) as record_count, 
       CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END as status FROM users
UNION ALL
SELECT 'user_profiles', COUNT(*), CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END FROM user_profiles
UNION ALL
SELECT 'ai_assessments', COUNT(*), CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END FROM ai_assessments
UNION ALL
SELECT 'user_journey_stages', COUNT(*), CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END FROM user_journey_stages;

SELECT '3. FOREIGN KEY RELATIONSHIP TESTS' as test_section;
SELECT 
    'FK Test' as test_type,
    'user_profiles -> users' as relationship,
    COUNT(*) as valid_links,
    CASE WHEN COUNT(*) = (SELECT COUNT(*) FROM user_profiles) THEN 'PASS' ELSE 'FAIL' END as status
FROM user_profiles up
JOIN users u ON up.user_id = u.id
UNION ALL
SELECT 
    'FK Test',
    'ai_assessments -> users',
    COUNT(*),
    CASE WHEN COUNT(*) = (SELECT COUNT(*) FROM ai_assessments) THEN 'PASS' ELSE 'FAIL' END
FROM ai_assessments a
JOIN users u ON a.user_id = u.id
UNION ALL
SELECT 
    'FK Test',
    'user_journey_stages -> users',
    COUNT(*),
    CASE WHEN COUNT(*) = (SELECT COUNT(*) FROM user_journey_stages) THEN 'PASS' ELSE 'FAIL' END
FROM user_journey_stages ujs
JOIN users u ON ujs.user_id = u.id;

SELECT '4. DATA QUALITY CHECKS' as test_section;
SELECT 
    'Data Quality' as test_type,
    'Valid email addresses' as check_name,
    COUNT(*) as valid_count,
    CASE WHEN COUNT(*) = (SELECT COUNT(*) FROM users) THEN 'PASS' ELSE 'FAIL' END as status
FROM users 
WHERE email IS NOT NULL AND email LIKE '%@%'
UNION ALL
SELECT 
    'Data Quality',
    'AI scores in valid range',
    COUNT(*),
    CASE WHEN COUNT(*) = (SELECT COUNT(*) FROM ai_assessments WHERE ai_readiness_score IS NOT NULL) THEN 'PASS' ELSE 'FAIL' END
FROM ai_assessments 
WHERE ai_readiness_score BETWEEN 0 AND 100
UNION ALL
SELECT 
    'Data Quality',
    'Journey stages in valid range',
    COUNT(*),
    CASE WHEN COUNT(*) = (SELECT COUNT(*) FROM user_journey_stages) THEN 'PASS' ELSE 'FAIL' END
FROM user_journey_stages 
WHERE current_stage BETWEEN 1 AND 5;

SELECT '5. API ENDPOINT DATA SIMULATION' as test_section;
SELECT 
    'API Simulation' as test_type,
    '/api/user-journey/1' as endpoint,
    CASE WHEN COUNT(*) > 0 THEN 'DATA_AVAILABLE' ELSE 'NO_DATA' END as status,
    COUNT(*) as record_count
FROM user_journey_stages ujs
LEFT JOIN users u ON ujs.user_id = u.id
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN ai_assessments a ON u.id = a.user_id
WHERE ujs.user_id = 1
UNION ALL
SELECT 
    'API Simulation',
    '/api/industry-comparison' as endpoint,
    CASE WHEN COUNT(*) > 0 THEN 'DATA_AVAILABLE' ELSE 'NO_DATA' END as status,
    COUNT(*) as record_count
FROM ai_assessments a
JOIN user_profiles up ON a.user_id = up.user_id
WHERE a.ai_readiness_score IS NOT NULL;

SELECT '6. COMPLETE USER DATA OVERVIEW' as test_section;
SELECT 
    u.id as user_id,
    u.email,
    up.job_title,
    a.ai_readiness_score,
    a.ai_familiarity,
    ujs.current_stage,
    ujs.stage_1_completed,
    CASE 
        WHEN a.ai_readiness_score IS NOT NULL THEN 'Assessment Complete'
        ELSE 'Assessment Pending'
    END as assessment_status,
    CASE 
        WHEN ujs.current_stage >= 2 THEN 'Active Journey'
        ELSE 'Getting Started'
    END as journey_status,
    CASE 
        WHEN a.ai_readiness_score >= 90 THEN 'Expert'
        WHEN a.ai_readiness_score >= 80 THEN 'Advanced'
        WHEN a.ai_readiness_score >= 70 THEN 'Intermediate'
        WHEN a.ai_readiness_score >= 60 THEN 'Beginner'
        ELSE 'Novice'
    END as skill_level
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN ai_assessments a ON u.id = a.user_id
LEFT JOIN user_journey_stages ujs ON u.id = ujs.user_id
ORDER BY u.id;

SELECT '7. DATABASE SUMMARY STATISTICS' as test_section;
SELECT 
    'Summary Stats' as stat_type,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM user_profiles WHERE job_title IS NOT NULL) as users_with_profiles,
    (SELECT COUNT(*) FROM ai_assessments WHERE ai_readiness_score IS NOT NULL) as completed_assessments,
    (SELECT ROUND(AVG(ai_readiness_score)) FROM ai_assessments WHERE ai_readiness_score IS NOT NULL) as avg_ai_score,
    (SELECT COUNT(*) FROM user_journey_stages WHERE stage_1_completed = true) as users_past_stage_1,
    (SELECT MAX(ai_readiness_score) FROM ai_assessments) as highest_score,
    (SELECT MIN(ai_readiness_score) FROM ai_assessments WHERE ai_readiness_score IS NOT NULL) as lowest_score;

SELECT '=== TEST COMPLETION STATUS ===' as test_footer;
SELECT 
    'Overall Database Health' as final_status,
    CASE 
        WHEN (SELECT COUNT(*) FROM users) > 0 
        AND (SELECT COUNT(*) FROM ai_assessments) > 0 
        AND (SELECT COUNT(*) FROM user_journey_stages) > 0 
        THEN 'HEALTHY - ALL SYSTEMS OPERATIONAL'
        ELSE 'ISSUES DETECTED - REVIEW REQUIRED'
    END as database_status;
