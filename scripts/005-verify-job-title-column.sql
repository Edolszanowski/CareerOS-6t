-- Verify that user_profiles table has job_title column with VARCHAR(200)

-- Check if user_profiles table exists
SELECT 
    table_name,
    table_schema
FROM information_schema.tables 
WHERE table_name = 'user_profiles';

-- Check if job_title column exists with correct specifications
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'job_title';

-- Show all columns in user_profiles table for context
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Check if the index exists
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'user_profiles' 
AND indexname = 'idx_user_profiles_job_title';

-- Test query to verify the column works
SELECT COUNT(*) as total_profiles,
       COUNT(job_title) as profiles_with_job_title
FROM user_profiles;

-- Verify the column was added correctly
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'user_profiles' 
                AND column_name = 'job_title'
                AND data_type = 'character varying'
                AND character_maximum_length = 200
        ) THEN '✅ SUCCESS: job_title column exists with VARCHAR(200)'
        ELSE '❌ FAILED: job_title column missing or incorrect type'
    END as verification_result;
