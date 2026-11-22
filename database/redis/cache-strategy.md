# Redis Cache Strategy - Urban Ride (RideSphere)

## 1. Overview
Redis 7 is deployed as an in-memory high-throughput data store providing sub-5ms latency for:
1. Geospatial driver indexing (`GEOADD`, `GEOSEARCH`)
2. Distributed locks for ride matching (`SET NX PX`)
3. Ephemeral session caching and JWT blacklist
4. Dynamic surge calculation caches
5. Rate limiting tokens (sliding window)

## 2. Eviction Policy
- **Config**: `maxmemory-policy volatile-lru`
- **TTL Enforcement**: All volatile keys (surge, rate limits, OTPs) have strict Time-To-Live. Driver geospatial sets are kept persistent via `appendonly yes`.

## 3. Resilience & High Availability
- Master-Replica with Redis Sentinel for automatic failover.
- Read requests for driver heatmaps and surge calculations are served from read replicas.
