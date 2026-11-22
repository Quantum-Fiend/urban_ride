# PostgreSQL Indexing Strategy & Performance Tuning

## 1. Primary Query Access Patterns & Indexes

| Table | Index Columns | Index Type | Query / Access Pattern Purpose |
| :--- | :--- | :--- | :--- |
| `users` | `email` | B-Tree (UNIQUE) | Sub-millisecond JWT authentication & login credential lookup. |
| `users` | `phone_number` | B-Tree (UNIQUE) | Fast lookup for phone SMS verification and rider identification. |
| `drivers` | `user_id` | B-Tree (UNIQUE) | Joins between authenticated JWT user context and driver domain profile. |
| `drivers` | `(status, vehicle_type)` | Composite B-Tree | Quick candidate filtering of online drivers before spatial ranking. |
| `trips` | `rider_id, created_at DESC` | Composite B-Tree | Rider ride history pagination without full table scan. |
| `trips` | `driver_id, status` | Composite B-Tree | Driver cockpit active trip check and daily completed trips ledger. |
| `trips` | `status` | Partial B-Tree | Fast matching dispatcher queries for unassigned `REQUESTED` trips. |
| `payments` | `idempotency_key` | Hash / B-Tree (UNIQUE) | Instant idempotency lookups on concurrent payment charges. |

## 2. Spatial Indexing
While Redis handles in-memory high-frequency candidate driver spatial lookups, PostgreSQL indexes historical trip endpoints:
```sql
CREATE INDEX idx_trips_pickup_coords ON trips (pickup_latitude, pickup_longitude);
CREATE INDEX idx_trips_dropoff_coords ON trips (dropoff_latitude, dropoff_longitude);
```
