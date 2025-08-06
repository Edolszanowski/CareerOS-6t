-- Update AI assessments table to match the required column names
-- Drop the existing table and recreate with correct column names

DROP TABLE IF EXISTS ai_assessments CASCADE;

CREATE TABLE ai_assessments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  
  -- Assessment responses matching your requirements
  question_1_journey VARCHAR(50),           -- AI journey stage
  question_2_industry VARCHAR(100),         -- Industry
  question_3a_level VARCHAR(50),            -- Experience level
  question_3b_role_title VARCHAR(100),      -- Role/job title
  question_4_knowledge VARCHAR(50),         -- AI knowledge level
  question_5_automation_pct INTEGER,        -- Automation percentage (0-100)
  question_6_superpower VARCHAR(50),        -- Professional superpower
  question_7_learning_style VARCHAR(50),    -- Learning style preference
  question_8_goal VARCHAR(50),              -- Future goal/vision
  
  -- Calculated AI readiness score (0-100)
  ai_readiness_score INTEGER DEFAULT 0,
  
  -- Metadata
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_assessments_user_id ON ai_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_assessments_email ON ai_assessments(email);
CREATE INDEX IF NOT EXISTS idx_ai_assessments_completed_at ON ai_assessments(completed_at);
CREATE INDEX IF NOT EXISTS idx_ai_assessments_score ON ai_assessments(ai_readiness_score);
