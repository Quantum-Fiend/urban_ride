-- ====================================================================
-- Urban Ride Database Initialization & Seed Script
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(30) NOT NULL UNIQUE,
    role VARCHAR(30) NOT NULL DEFAULT 'RIDER', -- RIDER, DRIVER, ADMIN
    wallet_balance NUMERIC(12, 2) NOT NULL DEFAULT 150.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Drivers Table
CREATE TABLE IF NOT EXISTS drivers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(100) NOT NULL UNIQUE,
    vehicle_model VARCHAR(100) NOT NULL,
    vehicle_color VARCHAR(50) NOT NULL,
    license_plate VARCHAR(50) NOT NULL UNIQUE,
    vehicle_type VARCHAR(30) NOT NULL DEFAULT 'ECONOMY',
    status VARCHAR(30) NOT NULL DEFAULT 'OFFLINE', -- OFFLINE, AVAILABLE, ON_TRIP, SUSPENDED
    current_latitude DOUBLE PRECISION,
    current_longitude DOUBLE PRECISION,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.95,
    total_trips INT NOT NULL DEFAULT 120,
    total_earnings NUMERIC(12, 2) NOT NULL DEFAULT 3240.50,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Pricing Rules
CREATE TABLE IF NOT EXISTS pricing_rules (
    id BIGSERIAL PRIMARY KEY,
    vehicle_type VARCHAR(30) NOT NULL UNIQUE,
    base_fare NUMERIC(10, 2) NOT NULL,
    rate_per_km NUMERIC(10, 2) NOT NULL,
    rate_per_minute NUMERIC(10, 2) NOT NULL,
    minimum_fare NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Trips Table
CREATE TABLE IF NOT EXISTS trips (
    id BIGSERIAL PRIMARY KEY,
    rider_id BIGINT NOT NULL REFERENCES users(id),
    driver_id BIGINT REFERENCES drivers(id),
    pickup_latitude DOUBLE PRECISION NOT NULL,
    pickup_longitude DOUBLE PRECISION NOT NULL,
    dropoff_latitude DOUBLE PRECISION NOT NULL,
    dropoff_longitude DOUBLE PRECISION NOT NULL,
    pickup_address VARCHAR(255) NOT NULL,
    dropoff_address VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'REQUESTED',
    vehicle_type VARCHAR(30) NOT NULL DEFAULT 'ECONOMY',
    fare NUMERIC(10, 2) NOT NULL,
    surge_multiplier NUMERIC(4, 2) NOT NULL DEFAULT 1.00,
    distance_km NUMERIC(8, 2) NOT NULL,
    duration_minutes INT NOT NULL,
    otp VARCHAR(10) NOT NULL,
    payment_method VARCHAR(30) NOT NULL DEFAULT 'WALLET',
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    cancellation_reason VARCHAR(255),
    requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    version BIGINT NOT NULL DEFAULT 0
);

-- 5. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL UNIQUE REFERENCES trips(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    transaction_ref VARCHAR(100) UNIQUE,
    idempotency_key VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Ratings Table
CREATE TABLE IF NOT EXISTS ratings (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL UNIQUE REFERENCES trips(id),
    rider_id BIGINT NOT NULL REFERENCES users(id),
    driver_id BIGINT NOT NULL REFERENCES drivers(id),
    score INT NOT NULL CHECK (score >= 1 AND score <= 5),
    feedback_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed Pricing Rules
INSERT INTO pricing_rules (vehicle_type, base_fare, rate_per_km, rate_per_minute, minimum_fare)
VALUES
    ('ECONOMY', 3.50, 1.25, 0.25, 6.00),
    ('COMFORT', 5.00, 1.75, 0.35, 9.00),
    ('XL', 7.50, 2.25, 0.45, 12.00),
    ('BLACK', 10.00, 3.25, 0.65, 18.00),
    ('EV', 4.00, 1.30, 0.25, 7.00)
ON CONFLICT (vehicle_type) DO NOTHING;

-- Seed Default Test Accounts (Passwords hashed with BCrypt for 'Password123!')
-- BCrypt hash: $2a$10$7EqJtq98hPqEX7fNZaFWoOhiMtiU0m2mY4x4f7z38B7b4bC.Lw91O
INSERT INTO users (id, email, password_hash, first_name, last_name, phone_number, role, wallet_balance)
VALUES
    (1, 'rider@ridesphere.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiMtiU0m2mY4x4f7z38B7b4bC.Lw91O', 'Sarah', 'Connor', '+15550100001', 'RIDER', 250.00),
    (2, 'driver@ridesphere.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiMtiU0m2mY4x4f7z38B7b4bC.Lw91O', 'Marcus', 'Wright', '+15550100002', 'DRIVER', 80.00),
    (3, 'admin@ridesphere.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiMtiU0m2mY4x4f7z38B7b4bC.Lw91O', 'Elena', 'Rostova', '+15550100003', 'ADMIN', 1000.00)
ON CONFLICT (id) DO NOTHING;

-- Seed Driver Details
INSERT INTO drivers (id, user_id, license_number, vehicle_model, vehicle_color, license_plate, vehicle_type, status, current_latitude, current_longitude, rating, total_trips, total_earnings)
VALUES
    (1, 2, 'DL-9842109X', 'Tesla Model 3', 'Midnight Silver', 'KA-01-EQ-9921', 'EV', 'AVAILABLE', 12.9716, 77.5946, 4.96, 384, 8420.00)
ON CONFLICT (id) DO NOTHING;

-- Reset Sequences
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('drivers_id_seq', (SELECT MAX(id) FROM drivers));
