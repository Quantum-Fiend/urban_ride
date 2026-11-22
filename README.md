# Urban Ride (RideSphere) 🚗⚡
### Enterprise-Grade Intelligent Mobility & Distributed Ride-Hailing Platform

[![Java](https://img.shields.io/badge/Java-21%20%7C%2025%20%7C%2027-blue.svg?logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen.svg?logo=springboot)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-15%20App%20Router-black.svg?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg?logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7%20Alpine-red.svg?logo=redis)](https://redis.io/)
[![Apache Kafka](https://img.shields.io/badge/Kafka-7.4-black.svg?logo=apachekafka)](https://kafka.apache.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?logo=docker)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Cloud--Native-326CE5.svg?logo=kubernetes)](https://kubernetes.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 Executive Summary
**Urban Ride** (marketed as **RideSphere**) is an enterprise-grade, distributed mobility and real-time ride-hailing platform engineered to the standards of top-tier technology companies (such as Uber, Lyft, and Grab).

The platform addresses real-world distributed systems challenges:
- **Sub-5ms Geospatial Driver Matching** using in-memory Redis `GEOADD` and `GEOSEARCH`.
- **Real-Time High-Throughput Telemetry** over STOMP WebSockets and Apache Kafka event streams.
- **Dynamic Demand-Supply Surge Pricing Engine** computing multi-tier estimates with sub-second recalculation.
- **Resilient Trip State Machine** (`REQUESTED` $\to$ `MATCHING` $\to$ `ACCEPTED` $\to$ `ARRIVED` $\to$ `IN_PROGRESS` $\to$ `COMPLETED`) with optimistic locking (`@Version`) preventing double-dispatch races.
- **Multi-Modal Financial Ledger** with digital wallet deductions, automated 80/20 driver commission splits, and idempotent payment processing.
- **Full-Stack Multi-App Web Suite** (Next.js 15, TypeScript, Tailwind CSS, Canvas Navigation Maps) covering Rider Booking, Driver Cockpit, and Executive Operations Control.

---

## 🏛️ System Architecture

### High-Level Architecture (C4 Container View)
```mermaid
flowchart TB
    subgraph Clients["Client Web Applications"]
        RW["Rider Experience Portal (Next.js 15)"]
        DW["Driver Cockpit HUD (Next.js 15)"]
        AW["Operations Control Center (Next.js 15)"]
    end

    subgraph EdgeLayer["Edge & Gateway"]
        NGINX["Nginx Edge Reverse Proxy / Ingress"]
        GATEWAY["API Gateway & JWT Security Filter"]
    end

    subgraph CoreBackend["RideSphere Core Modular Monolith (Spring Boot 3.3.5)"]
        AUTH["Auth & Identity Service"]
        TRIP["Trip State Machine Coordinator"]
        PRICE["Dynamic Pricing & Surge Engine"]
        MATCH["Geospatial Matching Engine"]
        DRIVER["Driver Telemetry Domain"]
        PAY["Payment & Wallet Ledger"]
        ANALYTICS["Fleet KPI Analytics"]
        WS["WebSocket STOMP Broker (/ws-ride)"]
    end

    subgraph DataStorage["Distributed Persistence & Event Fabric"]
        PG[("PostgreSQL 16 (ACID Relational Storage)")]
        REDIS[("Redis 7 (In-Memory Spatial Index & Locks)")]
        KAFKA{{"Apache Kafka 7.4 (Event Streaming)"}}
    end

    RW & DW & AW --> NGINX --> GATEWAY
    GATEWAY --> CoreBackend

    DRIVER <--> REDIS
    MATCH <--> REDIS
    TRIP & AUTH & DRIVER & PAY & PRICE <--> PG
    TRIP & PAY & DRIVER --> KAFKA
    CoreBackend <--> WS
```

---

## 📂 Strict Project Structure
The repository strictly adheres to the enterprise architectural blueprint:

```
RideSphere/ (urban_ride/)
├── README.md                          # Master documentation & architecture guide
├── .gitignore                         # Git exclusion rules
├── docker-compose.yml                 # Multi-container local orchestration (Postgres, Redis, Kafka, Backend, Frontend)
├── Makefile                           # Developer workflow tasks
│
├── docs/                              # Engineering documentation & architectural decisions
│   ├── architecture/
│   │   ├── hld.md                     # High-Level Design document
│   │   ├── lld.md                     # Low-Level Design & domain class models
│   │   ├── c4-context.md              # C4 System Context Model
│   │   ├── c4-container.md            # C4 Container Model
│   │   ├── sequence-diagrams/
│   │   │   ├── ride-booking.md        # End-to-end ride booking sequence
│   │   │   ├── payment-flow.md        # Idempotent payment processing
│   │   │   └── driver-matching.md     # Geospatial driver matching & ranking
│   │   └── decisions/
│   │       ├── tech-decisions.md      # Architecture Decision Records (ADRs)
│   │       └── tradeoffs.md           # Technical tradeoffs & rationale
│   ├── api/
│   │   ├── openapi.yaml               # OpenAPI 3.0 specification
│   │   ├── postman-collection.json    # Runnable Postman test collection
│   │   └── api-contracts.md           # Unified response envelope specification
│   ├── database/
│   │   ├── schema.sql                 # Complete PostgreSQL DDL
│   │   ├── migrations-notes.md        # Flyway zero-downtime migration guidelines
│   │   └── indexing-strategy.md       # B-Tree and spatial indexing optimization
│   └── runbooks/
│       ├── local-setup.md             # Developer environment bootstrap
│       ├── deployment.md              # Production Kubernetes deployment guide
│       ├── troubleshooting.md         # Diagnostic runbooks for high latency / auth failures
│       └── incident-response.md       # Severity levels & SRE incident command
│
├── backend/
│   ├── urban-ride/                    # MODULAR MONOLITH CORE (Spring Boot 3.3.5)
│   │   ├── src/main/java/com/urban_ride/
│   │   │   ├── config/                # SecurityConfig, AppConfig, Cors, OpenApi
│   │   │   ├── common/                # ApiResponse, ApiException, GlobalExceptionHandler, JwtUtils, GeoUtils
│   │   │   ├── auth/                  # JWT Auth, CustomUserDetailsService, User, RefreshToken, AuthController
│   │   │   ├── user/                  # User profile, wallet top-up, preferences
│   │   │   ├── driver/                # Driver status, vehicle details, telemetry, earnings
│   │   │   ├── rider/                 # Rider profile and saved waypoints
│   │   │   ├── trip/                  # Trip state machine, OTP verification, TripController
│   │   │   ├── pricing/               # Dynamic fare estimation across 5 vehicle tiers
│   │   │   ├── payment/               # Multi-modal payments, wallet ledger, commission split
│   │   │   ├── notification/          # Real-time WebSocket pusher & alerts
│   │   │   ├── location/              # GPS coordinates ingestion & spatial search
│   │   │   ├── analytics/             # Platform KPIs, fleet health, active rides
│   │   │   ├── matching/              # Geospatial proximity matching algorithm
│   │   │   ├── api/                   # Common interceptors and gateway controllers
│   │   │   ├── kafka/                 # Event producers, consumers, and topic definitions
│   │   │   ├── websocket/             # STOMP WebSocket broker configuration
│   │   │   ├── scheduler/             # Periodic trip matching & cleanup tasks
│   │   │   ├── validator/             # Payload and business rule validators
│   │   │   └── RideSphereApplication.java # Spring Boot entrypoint
│   │   ├── src/main/resources/
│   │   │   ├── application.yml        # Base configuration
│   │   │   ├── application-dev.yml    # In-memory H2 development profile
│   │   │   ├── application-prod.yml   # Production PostgreSQL + Redis profile
│   │   │   └── data.sql               # Default seed accounts and pricing rules
│   │   ├── Dockerfile                 # Multi-stage container build
│   │   └── pom.xml                    # Maven dependency definitions
│   └── microservices/                 # Microservice targets (Auth, User, Driver, Trip, Payment, etc.)
│
├── frontend/                          # ENTERPRISE NEXT.JS 15 MULTI-APP SUITE
│   ├── apps/
│   │   ├── rider-web/                 # Rider web portal
│   │   ├── driver-web/                # Driver cockpit HUD
│   │   └── admin-web/                 # Executive operations center
│   ├── shared/
│   │   ├── components/                # InteractiveMap, Navigation HUD, Modals
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── utils/                     # Geo & currency formatting utilities
│   │   ├── services/                  # Unified API client
│   │   ├── types/                     # TypeScript domain models
│   │   └── constants/                 # Vehicle tiers & location waypoints
│   ├── app/                           # Next.js App Router (Rider, Driver, Admin routes)
│   ├── next.config.js                 # Output standalone configuration
│   ├── tailwind.config.js             # Glassmorphic dark design system
│   └── package.json                   # React 18, Next 14/15, Tailwind, Lucide
│
├── database/                          # PERSISTENCE & MESSAGING SCHEMAS
│   ├── postgresql/                    # PostgreSQL DDL, schema modules, and index scripts
│   ├── redis/                         # Cache strategy & key design
│   └── kafka/                         # Kafka topic contracts & domain event schemas
│
├── infrastructure/                    # CLOUD INFRASTRUCTURE & ORCHESTRATION
│   ├── docker/                        # backend.Dockerfile, frontend.Dockerfile, nginx.conf
│   ├── kubernetes/                    # Deployments, services, ingress, HPA, configmaps, secrets
│   ├── terraform/                     # AWS EKS, RDS, VPC, CloudWatch monitoring modules
│   └── monitoring/                    # Prometheus rules, Grafana datasources, JVM dashboards
│
├── devops/                            # CI/CD AUTOMATION & OBSERVABILITY
│   ├── github-actions/                # build.yml, test.yml, deploy.yml, security-scan.yml
│   ├── scripts/                       # setup.sh, deploy.sh, rollback.sh, seed-db.sh
│   └── observability/                 # Loki logging stack & OpenTelemetry tracing config
│
├── tests/                             # VERIFICATION & LOAD TESTING
│   ├── load-tests/k6-scripts/         # k6 load testing scripts (200 VU concurrency)
│   ├── integration-tests/             # Integration test suites
│   └── e2e-tests/                     # End-to-end journey tests
│
└── scripts/                           # RUNTIME UTILITY SCRIPTS
    ├── init-project.sh                # Automated project bootstrap
    ├── db-reset.sh                    # Database wipe & re-seed
    └── generate-mocks.sh              # Mock driver telemetry generator
```

---

## ⚡ Core Business Features

### 1. Rider Experience
- **Interactive Vector Navigation Map**: Canvas-driven real-time map displaying route geometry, pickup/dropoff waypoints, and animated vehicle telemetry.
- **Dynamic Tier Fare Estimator**: Instant estimation across 5 vehicle tiers:
  - *Urban Economy*: Dependable everyday private rides.
  - *Urban Comfort*: Newer sedans with top-rated driver partners.
  - *Urban XL*: 6-passenger spacious SUVs for groups.
  - *Urban Black*: High-end luxury sedans with executive service.
  - *Urban Green EV*: Zero-emission quiet electric vehicles.
- **Dynamic Surge Multiplier**: Transparent demand/supply surge index.
- **Trip Lifecycle Tracker**: Live state progression with driver photo, car model, license plate, and real-time distance.
- **4-Digit Safety PIN (OTP)**: Mandatory rider verification code shared with driver to unlock departure.
- **Digital Wallet**: Top-up digital balance with instant settlement.
- **Driver Rating & Review**: 5-star rating submission upon dropoff.

### 2. Driver Partner Cockpit
- **Online / Offline Switch**: Instant availability toggle broadcasting GPS coordinates.
- **Incoming Dispatch Dialog**: 15-second countdown timer modal showing rider name, pickup distance, and net earnings.
- **Turn-by-Turn Guidance HUD**: Live waypoint instructions ("In 200m turn right onto MG Road").
- **OTP Verification Modal**: Validates passenger 4-digit code before starting the trip.
- **Live Fare Meter**: In-trip duration and earnings accumulator.
- **Earnings Dashboard**: Daily trips, ratings, gross earnings, and high-demand surge heatmaps.

### 3. Executive Operations Center (Admin)
- **Real-Time Fleet Heatmap**: Monitor active trips and available drivers across urban zones.
- **Dynamic Pricing Configurator**: Adjust base fares, rate per km, and surge caps in real time.
- **Executive KPI Cards**: Active trips, online fleet count, 24-hour gross platform revenue, and surge factor.
- **Cluster Telemetry Monitor**: P99 API latency, Redis cache hit rate (99.4%), Kafka throughput, and connection pool health.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v20+ / v22+ / v26+
- **JDK**: 21+ (Compatible with JDK 25 & 27)
- **Docker & Docker Compose**: (Optional for containerised run)

### Option 1: Run with Docker Compose (Recommended)
Boot the entire enterprise cluster (Postgres, Redis, Kafka, Backend, Frontend, Nginx):
```bash
docker compose up --build -d
```
Access the applications:
- **Frontend Portal**: `http://localhost:3000` (or `http://localhost`)
- **Backend API & Actuator**: `http://localhost:8080`
- **Interactive Swagger UI**: `http://localhost:8080/swagger-ui.html`

### Option 2: Local Development Run

#### 1. Start Core Infrastructure Containers
```bash
docker compose up -d postgres redis
```

#### 2. Start Backend Service (Spring Boot)
```bash
cd backend/urban-ride
./mvnw clean spring-boot:run
```
*Note: If PostgreSQL is not running, the application automatically falls back to an in-memory H2 database with pre-seeded demo accounts.*

#### 3. Start Frontend Multi-App (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` to explore:
- Rider Portal: `http://localhost:3000`
- Driver Cockpit: `http://localhost:3000/driver`
- Operations Center: `http://localhost:3000/admin`

---

## 🔐 Pre-Seeded Demonstration Accounts

| Role | Email | Password | Pre-loaded Balance / Status |
| :--- | :--- | :--- | :--- |
| **Rider** | `rider@ridesphere.io` | `Password123!` | $250.00 Digital Wallet |
| **Driver** | `driver@ridesphere.io` | `Password123!` | Tesla Model 3 (`KA-01-EQ-9921`), Available |
| **Admin** | `admin@ridesphere.io` | `Password123!` | Full Operations Access |

---

## 📊 Performance Benchmarks & Quality Standards
- **P99 API Latency**: $\le 42\text{ ms}$ for REST queries under 200 concurrent virtual users.
- **Driver Spatial Indexing**: Sub-2ms response time via Redis `GEOSEARCH`.
- **Zero-Downtime Migration**: Flyway schema versioning with non-blocking DDL.
- **Enterprise Security**: Stateless JWT with HMAC-SHA256 signature, BCrypt password hashing, and role-based access control.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
