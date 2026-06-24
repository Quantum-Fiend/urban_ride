-- Production schema for Ratings and Reviews table
CREATE TABLE IF NOT EXISTS ratings (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT UNIQUE NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    rater_id BIGINT NOT NULL REFERENCES users(id),
    ratee_id BIGINT NOT NULL REFERENCES users(id),
    score INT NOT NULL CHECK (score >= 1 AND score <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
