# Redis Key Schema & Design

## 1. Geospatial Driver Keys
- `geo:drivers:{tier}`: Sorted set storing coordinates of online available drivers.
  - Type: Geospatial (`GEOADD`)
  - Key Example: `geo:drivers:ECONOMY`, `geo:drivers:COMFORT`, `geo:drivers:BLACK`
  - Member: `driver:{driverId}`
  - Example: `GEOADD geo:drivers:COMFORT 77.5946 12.9716 driver:102`

## 2. Distributed Locks
- `lock:trip:{tripId}`: Prevents concurrent state transitions.
  - TTL: 15 seconds
  - Format: `SET lock:trip:501 {node_uuid} NX PX 15000`

## 3. Ephemeral OTPs
- `otp:trip:{tripId}`: 4-digit ride verification code.
  - TTL: 30 minutes
  - Value: `4921`

## 4. Surge Calculation Cache
- `surge:zone:{h3_index}`: Precomputed surge multiplier for a geographic hexagon.
  - TTL: 60 seconds
  - Value: `1.4`

## 5. Rate Limiting Keys
- `rate:ip:{ip_address}:{timestamp_minute}`: Request counter.
  - TTL: 120 seconds
