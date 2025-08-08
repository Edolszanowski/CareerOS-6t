CREATE TABLE IF NOT EXISTS user_journey_stages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    current_stage INTEGER DEFAULT 1 CHECK (current_stage >= 1 AND current_stage <= 5),
    stage_1_completed BOOLEAN DEFAULT FALSE,
    stage_2_completed BOOLEAN DEFAULT FALSE,
    stage_3_completed BOOLEAN DEFAULT FALSE,
    stage_4_completed BOOLEAN DEFAULT FALSE,
    stage_5_completed BOOLEAN DEFAULT FALSE,
    stage_1_completed_at TIMESTAMP,
    stage_2_completed_at TIMESTAMP,
    stage_3_completed_at TIMESTAMP,
    stage_4_completed_at TIMESTAMP,
    stage_5_completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_journey_stages_user_id ON user_journey_stages(user_id);
CREATE INDEX IF NOT EXISTS idx_user_journey_stages_current_stage ON user_journey_stages(current_stage);

INSERT INTO user_journey_stages (user_id, current_stage, stage_1_completed, stage_1_completed_at)
SELECT 
    a.user_id,
    2,
    TRUE,
    a.completed_at
FROM ai_assessments a
LEFT JOIN user_journey_stages ujs ON a.user_id = ujs.user_id
WHERE ujs.user_id IS NULL
AND a.ai_readiness_score IS NOT NULL;

INSERT INTO user_journey_stages (user_id, current_stage, stage_1_completed)
SELECT 
    u.id,
    1,
    FALSE
FROM users u
LEFT JOIN user_journey_stages ujs ON u.id = ujs.user_id
WHERE ujs.user_id IS NULL;
