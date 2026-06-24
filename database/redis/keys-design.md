# Redis Keyspace Schema Design

| Key Pattern | Data Structure | TTL | Description |
|---|---|---|---|
| session:{userId} | String | 1 Hour | User authorization session data |
| driver:location:{driverId} | GeoHash | 60 Seconds | Live coordinate tracking for drivers |
| ide:lock:{tripId} | String | 10 Seconds | Distributed lock to prevent double matching |
