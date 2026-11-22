# Local Setup Runbook

## Prerequisites
- **Java JDK**: 21+ (Compatible with JDK 25 & 27)
- **Node.js**: v20+ / v22+ / v26+
- **Docker & Docker Compose**: Installed and running
- **PostgreSQL**: 16 (or local Docker container)
- **Redis**: 7 (or local Docker container)

## 1. Quick Start via Docker Compose
To boot up the complete infrastructure (PostgreSQL, Redis, Kafka, Zookeeper):
```bash
docker compose up -d postgres redis kafka zookeeper
```

## 2. Bootstrapping the Backend
Navigate to the modular monolith directory:
```bash
cd backend/urban-ride
./mvnw clean spring-boot:run
```
The backend initializes on `http://localhost:8080`.
- API Health: `http://localhost:8080/actuator/health`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

## 3. Bootstrapping the Frontend
Navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
Access the client applications:
- **Rider Web Experience**: `http://localhost:3000`
- **Driver Cockpit & Dispatch**: `http://localhost:3000/driver`
- **Admin Operations Center**: `http://localhost:3000/admin`
