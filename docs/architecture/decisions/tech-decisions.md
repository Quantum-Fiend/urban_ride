# Architectural Decision Records (ADRs) - Technical Decisions

## ADR 001: Modular Monolith vs. Distributed Microservices
- **Status**: Approved
- **Context**: High-scale ride-hailing requires real-time coordination between riders, drivers, pricing, and trips. A premature microservice split introduces distributed transaction overhead, network latency penalties, deployment complexity, and dual-write consistency problems.
- **Decision**: Adopt a **Modular Monolith** first architecture in Spring Boot with strict domain boundaries (`com.urban_ride.trip`, `com.urban_ride.driver`, etc.), clean interfaces, and domain events.
- **Consequences**: Fast local compilation, single transaction boundaries when needed, sub-millisecond inter-domain method calls, and straightforward zero-downtime deployment. Microservice migration remains trivial via prepared boundary interfaces.

## ADR 002: In-Memory Geospatial Indexing with Redis
- **Status**: Approved
- **Context**: 50,000 drivers broadcasting GPS coordinates every 3 seconds generates 16,666 writes per second. Writing these raw pings directly to PostgreSQL disk causes write amplifications and table lock contention.
- **Decision**: Use Redis `GEOADD` and `GEOSEARCH` in memory for live driver locations, paired with PostgreSQL for persistent completed trip history and auditing.
- **Consequences**: Ingestion latency drops below 2ms. Primary PostgreSQL database remains dedicated to high-value ACID financial and trip state transactions.

## ADR 003: JWT Authentication with Refresh Token Rotation
- **Status**: Approved
- **Context**: Edge clients (Rider, Driver, Admin) require stateless authentication with tight revocation controls.
- **Decision**: Issue short-lived Access Tokens (15 minutes) and long-lived Refresh Tokens (7 days) stored with hashed signatures in PostgreSQL. Token revocation is enforced via Redis token blacklist for immediate logout.
- **Consequences**: High throughput validation at API Gateway level without hitting the user database on every single request.
