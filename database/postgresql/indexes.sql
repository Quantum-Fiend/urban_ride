-- ====================================================================
-- Production Indexes for PostgreSQL - Urban Ride
-- ====================================================================

-- User & Authentication Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Driver Indexes
CREATE INDEX IF NOT EXISTS idx_drivers_user_id ON drivers(user_id);
CREATE INDEX IF NOT EXISTS idx_drivers_status_tier ON drivers(status, vehicle_type);
CREATE INDEX IF NOT EXISTS idx_drivers_rating ON drivers(rating DESC);

-- Trip Lifecycle Indexes
CREATE INDEX IF NOT EXISTS idx_trips_rider_history ON trips(rider_id, requested_at DESC);
CREATE INDEX IF NOT EXISTS idx_trips_driver_history ON trips(driver_id, requested_at DESC);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON trips(requested_at DESC);

-- Payment Indexes
CREATE INDEX IF NOT EXISTS idx_payments_trip_id ON payments(trip_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_idempotency ON payments(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Rating Indexes
CREATE INDEX IF NOT EXISTS idx_ratings_driver_id ON ratings(driver_id);
CREATE INDEX IF NOT EXISTS idx_ratings_trip_id ON ratings(trip_id);
