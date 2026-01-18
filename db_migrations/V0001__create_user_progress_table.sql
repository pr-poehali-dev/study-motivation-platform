CREATE TABLE IF NOT EXISTS user_progress (
    user_id VARCHAR(255) PRIMARY KEY,
    total_xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    streak INTEGER NOT NULL DEFAULT 0,
    subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
    webinars_watched INTEGER NOT NULL DEFAULT 0,
    videos_watched INTEGER NOT NULL DEFAULT 0,
    tasks_completed INTEGER NOT NULL DEFAULT 0,
    mock_tests_completed INTEGER NOT NULL DEFAULT 0,
    mock_tests JSONB NOT NULL DEFAULT '[]'::jsonb,
    achievements JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
