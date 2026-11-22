# Database Migration Notes

## Schema Migration Pipeline
Urban Ride uses **Flyway** (`db/migration/`) to manage deterministic, zero-downtime database schema versioning.

### Naming Convention
`V{Major}_{Minor}__{Description}.sql`
- `V1_0__init_schema.sql`: Foundational user, driver, trip, payment, and pricing DDL.
- `V1_1__add_indexes.sql`: Performance indexes and foreign key constraints.
- `V1_2__seed_pricing_and_mock_data.sql`: Base pricing rules and initial test seed data.

### Production Zero-Downtime Migration Rules
1. Never rename columns in place. Use `ADD COLUMN` $\to$ dual write $\to$ backfill $\to$ drop old column across 3 consecutive releases.
2. Always create indexes with `CONCURRENTLY` on high-traffic production databases to prevent table-level write locks.
3. Every migration script must be idempotent and tested against PostgreSQL 16.
