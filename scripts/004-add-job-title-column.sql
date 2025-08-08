-- Add job_title column to user_profiles table for newsletter personalization
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS job_title VARCHAR(200);

-- Add index for better query performance when filtering by job title
CREATE INDEX IF NOT EXISTS idx_user_profiles_job_title ON user_profiles(job_title);

-- Add comment to document the purpose
COMMENT ON COLUMN user_profiles.job_title IS 'User job title for newsletter personalization and role-specific content targeting';
