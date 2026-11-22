# Urban Ride (RideSphere) - High-Level Design (HLD)

## 1. Executive Summary
Urban Ride (marketed as **RideSphere**) is an enterprise-grade, distributed, intelligent mobility and ride-hailing platform engineered to support high-throughput, low-latency concurrent ride dispatches, real-time driver telemetry streaming, dynamic surge pricing, and resilient financial transactions.

The platform follows a **Modular Monolith First** architecture for rapid cohesion, strict type boundaries, and streamlined operations, with a pre-designed domain boundary migration path toward distributed cloud-native microservices.

---

## 2. Business Architecture & Capabilities
```mermaid
graph TD
    subgraph RiderDomain[Rider Domain]
        R1[Search & Reverse Geocoding]
        R2[Dynamic Fare Estimation]
        R3[Ride Dispatch Request]
        R4[Live Driver Telemetry Tracking]
        R5[Split Fare & Digital Payment]
        R6[Driver Rating & Review]
    end

    subgraph DriverDomain[Driver Domain]
        D1[Driver Onboarding & KYC]
        D2[Availability & Telemetry Broadcast]
        D3[Dispatch Offer & Bidding Engine]
        D4[Turn-by-Turn Waypoint Navigation]
        D5[Trip Execution: Start, Pause, End]
        D6[Earnings Analytics & Instant Payouts]
    end

    subgraph PlatformCore[Platform Core Services]
        P1[Geospatial Driver Matching Engine]
        P2[Dynamic Surge & Tier Pricing]
        P3[State Machine Trip Coordinator]
        P4[Payment Gateway Abstraction]
        P5[Event Streaming Bus Kafka]
        P6[WebSocket Real-Time Notification Fabric]
    end

    subgraph AdminOps[Admin & Enterprise Ops]
        A1[Live Operations Heatmap]
        A2[Driver KYC & Vehicle Verification]
        A3[Dynamic Pricing Rule Engine]
        A4[Dispute Resolution & Audit Log]
    end

    RiderDomain --> PlatformCore
    DriverDomain --> PlatformCore
    AdminOps --> PlatformCore
```

---

## 3. High-Level System Architecture
```mermaid
flowchart TB
    subgraph Clients["Client Applications"]
        RW["Rider Web App (Next.js 15)"]
        DW["Driver Web App (Next.js 15)"]
        AW["Admin Operations Portal (Next.js 15)"]
    end

    subgraph IngressLayer["Edge & Ingress Layer"]
        CF["Cloudflare Edge CDN / WAF"]
        ALB["AWS ALB / Nginx Reverse Proxy"]
    end

    subgraph CoreBackend["RideSphere Core Platform (Spring Boot)"]
        GW["API Gateway & JWT Auth Interceptor"]
        
        subgraph Domains["Modular Monolith Domains"]
            AUTH["Auth & Identity Service"]
            USER["User & KYC Domain"]
            DRIVER["Driver Management Domain"]
            MATCH["Geospatial Matching Engine"]
            TRIP["Trip Lifecycle Coordinator"]
            PRICE["Dynamic Pricing & Surge Engine"]
            PAY["Payment & Ledger Engine"]
            LOC["Location Telemetry Processor"]
            NOTIF["Notification & Real-Time Pusher"]
            ANALYTICS["Business Intelligence Engine"]
        end
    end

    subgraph StateAndStorage["Data & State Persistence"]
        PG[("PostgreSQL 16 (Primary DB + PostGIS)")]
        REDIS[("Redis 7 (Geo Indexes + Session Cache)")]
        KAFKA{{"Apache Kafka 7.4 (Event Streaming)"}}
        S3["AWS S3 / MinIO (Document Storage)"]
    end

    subgraph MonitoringStack["Observability & Reliability"]
        PROM["Prometheus Time-Series DB"]
        GRAF["Grafana Dashboards"]
        OTEL["OpenTelemetry Collector & Jaeger"]
    end

    RW & DW & AW --> CF --> ALB --> GW
    GW --> AUTH & USER & DRIVER & MATCH & TRIP & PRICE & PAY & LOC & NOTIF & ANALYTICS

    LOC <--> REDIS
    MATCH <--> REDIS
    AUTH & USER & DRIVER & TRIP & PAY & PRICE <--> PG
    TRIP & PAY & LOC --> KAFKA
    KAFKA --> NOTIF
    KAFKA --> ANALYTICS

    CoreBackend -. Metrics & Traces .-> PROM & OTEL
    PROM --> GRAF
```

---

## 4. Key Architectural Patterns & Decisions
1. **Modular Monolith with Domain-Driven Design (DDD)**: Single deployable artifact eliminating distributed transaction failure modes while retaining strict logical boundary isolation (`auth`, `user`, `driver`, `trip`, `pricing`, `matching`, `payment`, `location`).
2. **In-Memory Geospatial Indexing via Redis**: Drivers push coordinates every 3-5 seconds. Redis `GEOADD` and `GEORADIUS` / `GEOSEARCH` enable sub-5ms driver proximity lookup without overwhelming the relational database.
3. **Optimistic Locking & State Machine Integrity**: Trips use an explicit state machine:
   `REQUESTED` $\to$ `MATCHING` $\to$ `ACCEPTED` $\to$ `ARRIVED` $\to$ `IN_PROGRESS` $\to$ `COMPLETED` / `CANCELLED`.
   State transitions are protected with version numbers (`@Version`) preventing double-accept race conditions across competing drivers.
4. **Idempotent Payment Processing**: All payment initiation requests require unique UUID idempotency keys stored in Redis/PostgreSQL with a 120-second lease window.
5. **Decoupled Asynchronous Events via Kafka**: High-volume telemetry and post-trip lifecycle side effects (email invoices, driver payout calculations, fraud audits) emit domain events onto Kafka topics.

---

## 5. Non-Functional Requirements (NFR) Benchmarks
- **Availability**: 99.99% uptime with multi-AZ container deployments.
- **P99 API Latency**: $\le 120\text{ ms}$ for standard REST queries; $\le 50\text{ ms}$ for geolocation pings.
- **Throughput Target**: 10,000 concurrent active trips, 50,000 driver telemetry pings/sec.
- **RTO & RPO**: Recovery Time Objective $\le 15\text{ min}$; Recovery Point Objective $\le 1\text{ min}$.
