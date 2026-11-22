-- Initial seed for local in-memory development
INSERT INTO users (id, email, password_hash, first_name, last_name, phone_number, role, wallet_balance, is_active, created_at, updated_at)
VALUES
    (1, 'rider@ridesphere.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiMtiU0m2mY4x4f7z38B7b4bC.Lw91O', 'Sarah', 'Connor', '+15550100001', 'RIDER', 250.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'driver@ridesphere.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiMtiU0m2mY4x4f7z38B7b4bC.Lw91O', 'Marcus', 'Wright', '+15550100002', 'DRIVER', 80.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'admin@ridesphere.io', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiMtiU0m2mY4x4f7z38B7b4bC.Lw91O', 'Elena', 'Rostova', '+15550100003', 'ADMIN', 1000.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO drivers (id, user_id, license_number, vehicle_model, vehicle_color, license_plate, vehicle_type, status, current_latitude, current_longitude, rating, total_trips, total_earnings, is_verified, created_at, updated_at)
VALUES
    (1, 2, 'DL-9842109X', 'Tesla Model 3', 'Midnight Silver', 'KA-01-EQ-9921', 'EV', 'AVAILABLE', 12.9716, 77.5946, 4.96, 384, 8420.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO pricing_rules (id, vehicle_type, base_fare, rate_per_km, rate_per_minute, minimum_fare, created_at)
VALUES
    (1, 'ECONOMY', 3.50, 1.25, 0.25, 6.00, CURRENT_TIMESTAMP),
    (2, 'COMFORT', 5.00, 1.75, 0.35, 9.00, CURRENT_TIMESTAMP),
    (3, 'XL', 7.50, 2.25, 0.45, 12.00, CURRENT_TIMESTAMP),
    (4, 'BLACK', 10.00, 3.25, 0.65, 18.00, CURRENT_TIMESTAMP),
    (5, 'EV', 4.00, 1.30, 0.25, 7.00, CURRENT_TIMESTAMP);
