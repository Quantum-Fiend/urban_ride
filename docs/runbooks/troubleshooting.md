# Troubleshooting Runbook

## 1. High Driver Matching Latency (> 500ms)
- **Symptom**: Riders see prolonged "Finding your driver..." spinner.
- **Diagnostics**:
  1. Check Redis memory and slowlog: `redis-cli SLOWLOG GET 10`.
  2. Verify driver availability count: `redis-cli ZCARD geo:drivers:available:ECONOMY`.
  3. Inspect PostgreSQL connection pool utilization via Actuator: `/actuator/metrics/hikaricp.connections.active`.
- **Mitigation**:
  - Scale Redis read replicas.
  - Expand driver search radius from 5km to 8km in dynamic config.

## 2. JWT Authentication Failures
- **Symptom**: HTTP 401 Unauthorized across mobile or web clients.
- **Diagnostics**:
  - Verify clock drift between servers using NTP.
  - Check JWT secret consistency across pod replicas.
- **Mitigation**: Refresh token rotation automatically re-issues access tokens without prompting re-login.
