-- First, let's see what columns actually exist in each table
SELECT '=== ACTUAL TABLE SCHEMAS ===' as header;

SELECT '1. USERS TABLE STRUCTURE' as section;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT '2. USER_PROFILES TABLE STRUCTURE' as section;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT '3. AI_ASSESSMENTS TABLE STRUCTURE' as section;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'ai_assessments' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT '4. USER_JOURNEY_STAGES TABLE STRUCTURE' as section;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_journey_stages' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT '5. SAMPLE DATA FROM AI_ASSESSMENTS' as section;
SELECT * FROM ai_assessments LIMIT 3;

SELECT '6. SAMPLE DATA FROM USER_JOURNEY_STAGES' as section;
SELECT * FROM user_journey_stages LIMIT 3;
