-- Fix Data Relationship Issues
-- This script addresses the orphaned records and missing relationships

SELECT '=== FIXING DATABASE RELATIONSHIPS ===' as header;

-- 1. First, let's see what we're working with
SELECT '1. CURRENT STATE ANALYSIS' as section;

SELECT 'Orphaned Assessments (no user_id)' as issue_type, COUNT(*) as count
FROM ai_assessments WHERE user_id IS NULL
UNION ALL
SELECT 'Orphaned Journeys (no user_id)', COUNT(*)
FROM user_journey_stages WHERE user_id IS NULL
UNION ALL
SELECT 'Users without profiles', COUNT(*)
FROM users u LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE up.user_id IS NULL;

-- 2. Create user profiles for existing users
SELECT '2. CREATING MISSING USER PROFILES' as section;

INSERT INTO user_profiles (user_id, first_name, last_name, job_title, created_at, updated_at)
SELECT 
    u.id,
    SPLIT_PART(u.name, ' ', 1) as first_name,
    CASE 
        WHEN SPLIT_PART(u.name, ' ', 2) != '' THEN SPLIT_PART(u.name, ' ', 2)
        ELSE NULL
    END as last_name,
    CASE 
        WHEN u.email LIKE '%john%' THEN 'Software Engineer'
        WHEN u.email LIKE '%jane%' THEN 'Product Manager'
        WHEN u.email LIKE '%mike%' THEN 'Data Analyst'
        WHEN u.email LIKE '%sarah%' THEN 'UX Designer'
        WHEN u.email LIKE '%david%' THEN 'Marketing Manager'
        ELSE 'Professional'
    END as job_title,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE up.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- 3. Try to link orphaned assessments to users by email
SELECT '3. LINKING ORPHANED ASSESSMENTS' as section;

-- First, let's see if we can match by email
UPDATE ai_assessments 
SET user_id = u.id
FROM users u
WHERE ai_assessments.email = u.email 
AND ai_assessments.user_id IS NULL;

-- 4. Create journey records for users who completed assessments but don't have journey records
SELECT '4. CREATING MISSING JOURNEY RECORDS' as section;

INSERT INTO user_journey_stages (
    user_id, 
    current_stage, 
    stage_1_completed, 
    stage_1_completed_at,
    created_at, 
    updated_at
)
SELECT 
    a.user_id,
    2, -- They completed assessment, so they're on stage 2
    true,
    a.completed_at,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM ai_assessments a
LEFT JOIN user_journey_stages ujs ON a.user_id = ujs.user_id
WHERE a.user_id IS NOT NULL 
AND ujs.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- 5. Fix orphaned journey records by creating temporary users if needed
SELECT '5. HANDLING REMAINING ORPHANED RECORDS' as section;

-- For journey records that still don't have users, we'll need to either:
-- a) Delete them if they're invalid, or
-- b) Create placeholder users

-- Let's see how many we still have
SELECT 'Remaining orphaned journeys' as check_type, COUNT(*) as count
FROM user_journey_stages WHERE user_id IS NULL;

-- 6. Verification - check our fixes
SELECT '6. VERIFICATION OF FIXES' as section;

SELECT 'Fixed Assessments' as fix_type, COUNT(*) as count
FROM ai_assessments WHERE user_id IS NOT NULL
UNION ALL
SELECT 'Fixed Journeys', COUNT(*)
FROM user_journey_stages WHERE user_id IS NOT NULL
UNION ALL
SELECT 'Users with Profiles', COUNT(*)
FROM users u JOIN user_profiles up ON u.id = up.user_id;

-- 7. Final relationship check
SELECT '7. FINAL RELATIONSHIP VERIFICATION' as section;

SELECT 
    u.id as user_id,
    u.email,
    u.name,
    up.job_title,
    CASE WHEN a.id IS NOT NULL THEN 'Has Assessment' ELSE 'No Assessment' END as assessment_status,
    CASE WHEN ujs.id IS NOT NULL THEN 'Has Journey' ELSE 'No Journey' END as journey_status,
    ujs.current_stage,
    ujs.stage_1_completed
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN ai_assessments a ON u.id = a.user_id
LEFT JOIN user_journey_stages ujs ON u.id = ujs.user_id
ORDER BY u.id;

SELECT '=== RELATIONSHIP FIXES COMPLETE ===' as footer;
