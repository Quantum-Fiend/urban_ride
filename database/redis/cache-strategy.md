# Redis Cache Eviction & Read/Write Strategies

## Cache Policy
- Use **volatile-lru** (Least Recently Used with TTL) to evict expired sessions automatically.
- Driver coordinates are self-evicting using 60-second TTL.

## Distributed Locks
Used to coordinate ride acceptances:
- Acquire lock with SET ride:lock:{tripId} unique_token NX PX 10000.
- Release with Lua script validation.
