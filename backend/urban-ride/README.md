# RideSphere Core (Modular Monolith)

## Overview
RideSphere Core is a production-grade, Domain-Driven Design (DDD) modular monolith built with **Spring Boot 3.3.5** and **Java 21/25/27**. It encapsulates all core mobility domains with strict boundaries, sub-millisecond inter-domain communication, and real-time WebSocket telemetry.

## Key Domains
- `com.urban_ride.auth`: Stateless JWT authentication (access + refresh tokens), BCrypt password encryption, RBAC.
- `com.urban_ride.trip`: Comprehensive ride lifecycle state machine (`REQUESTED` $\to$ `MATCHING` $\to$ `ACCEPTED` $\to$ `ARRIVED` $\to$ `IN_PROGRESS` $\to$ `COMPLETED`).
- `com.urban_ride.pricing`: Dynamic fare estimator with time, distance, and surge calculations across 5 vehicle tiers.
- `com.urban_ride.driver`: Driver cockpit controls, status management, vehicle registrations, and earnings tracking.
- `com.urban_ride.matching`: Proximity-based driver matching and dispatch engine.
- `com.urban_ride.payment`: Multi-modal billing (Digital Wallet, Credit Card, UPI, Cash) with idempotency guarantees.
- `com.urban_ride.analytics`: Fleet health, revenue volume, and active ride telemetry.
- `com.urban_ride.websocket`: STOMP over WebSocket broker for live GPS coordinates and ride events.

## Build and Run
```bash
# Build
./mvnw clean package -DskipTests

# Run Locally with in-memory H2
./mvnw spring-boot:run
```

Access Swagger UI at `http://localhost:8080/swagger-ui.html`.
