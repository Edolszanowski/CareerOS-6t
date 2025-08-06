-- Create AI assessment results table with correct data types
CREATE TABLE IF NOT EXISTS ai_assessments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  
  -- Assessment responses using VARCHAR for enums
  ai_journey VARCHAR(50),
  industry VARCHAR(100),
  role_category VARCHAR(50),
  role_function VARCHAR(100),
  understanding_level VARCHAR(50),
  work_assistance_percentage INTEGER,
  superpower VARCHAR(50),
  learning_style VARCHAR(50),
  vision VARCHAR(50),
  
  -- Calculated scores
  ai_preparedness_score INTEGER DEFAULT 0,
  usage_score INTEGER DEFAULT 0,
  understanding_score INTEGER DEFAULT 0,
  future_readiness_score INTEGER DEFAULT 0,
  overall_score INTEGER DEFAULT 0,
  
  -- Metadata using TIMESTAMP (not timestamptz)
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_ai_assessments_user_id ON ai_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_assessments_email ON ai_assessments(email);
CREATE INDEX IF NOT EXISTS idx_ai_assessments_completed_at ON ai_assessments(completed_at);
