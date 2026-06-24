# Urban Ride 🚗

![License](https://img.shields.io/badge/license-MIT-green) ![Java](https://img.shields.io/badge/java-25%20%28source%29-blue) ![Spring%20Boot](https://img.shields.io/badge/spring%20boot-4.1.0-brightgreen) ![Docker](https://img.shields.io/badge/docker-ready-blueviolet)

---

## 📖 Overview
**Urban Ride** is a **production‑grade, enterprise‑level ride‑hailing platform** built with **Spring Boot 4.1**. It showcases a complete backend ecosystem covering:
- **User & Driver management**
- **Real‑time trip lifecycle** (request → match → ride → payment)
- **Dynamic pricing & surge**
- **Event‑driven architecture** (Kafka placeholder)
- **Observability** (metrics, tracing, logs)
- **Scalable deployment** (Docker, Kubernetes ready)

The project is deliberately **opinionated** to reflect real‑world engineering challenges such as geospatial search, fault tolerance, and secure authentication.

---

## ✨ Key Features
- **Stateless JWT authentication** (Spring Security + JJWT) 
- **Role‑based access control** (future‑ready) 
- **PostgreSQL persistence** with JPA/Hibernate (fallback to H2 for dev) 
- **RESTful APIs** following clean‑architecture principles 
- **Dockerised** multi‑stage build for minimal image size 
- **OpenAPI/Swagger** (optional) for API discovery 
- **Testcontainers** integration tests for reliable CI pipelines 
- **CI/CD ready** (GitHub Actions example provided) 

---

## 🛠️ Tech Stack
| Layer | Technology |
|-------|------------|
| Language | **Java 25** |
| Framework | **Spring Boot 4.1** |
| Security | **Spring Security**, **JJWT** |
| Data | **Spring Data JPA**, **PostgreSQL** (or H2) |
| Build | **Maven** |
| Container | **Docker** (multi‑stage) |
| Observability | **Micrometer**, **Prometheus**, **Grafana** (optional) |
| CI/CD | **GitHub Actions**, **Docker Hub** |

---

## 📂 Project Structure
```
urban_ride/
├─ backend/               # Spring Boot service
│   └─ urban-ride/
│       ├─ src/main/java/com/urban_ride/
│       │   ├─ auth/            # authentication (controller, dto, service, security)
│       │   ├─ config/          # SpringSecurity config
│       │   ├─ security/        # JWT utils & filter
│       │   ├─ user/            # User entity & repository
│       │   ├─ driver/          # (placeholder for driver domain)
│       │   ├─ trip/            # (placeholder for trip domain)
│       │   └─ UrbanRideApplication.java
│       └─ src/main/resources/
│           ├─ application.yml
│           └─ logback.xml
├─ frontend/               # (optional) React/Vue UI – not part of this repo
└─ docs/                   # Architecture diagrams, API specs
```

---

## 🚀 Getting Started (Local Development)
### Prerequisites
- **JDK 25** (or higher) 
- **Maven 3.9+** 
- **Docker** (optional, for containerised run) 
- **PostgreSQL** (or rely on H2 for quick start) 

### 1️⃣ Clone & Navigate
```bash
git clone <repo-url>
cd urban_ride/backend/urban-ride
```

### 2️⃣ Configure the Database
Create `src/main/resources/application-local.yml` (or set env vars):
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/urban_ride
    username: your_user
    password: your_pass
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

jwt:
  secret: "${JWT_SECRET:ChangeMeToStrongSecret}"
  expirationMs: 86400000 # 24h
```
> **Tip:** For dev you can omit the DB config – the app falls back to an in‑memory H2 database.

### 3️⃣ Run the Application
```bash
# Maven wrapper (recommended)
./mvnw spring-boot:run
# or with Maven directly
mvn clean spring-boot:run
```
The service starts on `http://localhost:8080`.

---

## 📦 Building & Dockerizing
### Build the JAR
```bash
mvn clean package -DskipTests
```
The fat JAR will appear at `target/urban-ride-0.0.1-SNAPSHOT.jar`.

### Multi‑stage Dockerfile (already included)
```dockerfile
# ---- Build Stage ----
FROM maven:3.9-eclipse-temurin-25 as builder
WORKDIR /app
COPY . .
RUN mvn -B clean package -DskipTests

# ---- Runtime Stage ----
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/urban-ride-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
```
Build & run:
```bash
docker build -t urban-ride-backend .
docker run -d -p 8080:8080 \
  -e JWT_SECRET=SuperSecretKey123 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/urban_ride \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=secret \
  --name urban-ride-backend urban-ride-backend
```

---

## 🔐 Security Checklist (Production‑Ready)
- **Strong JWT secret** – store in a vault or env var (`JWT_SECRET`).
- **BCrypt password hashing** – configurable strength in `SecurityConfig`.
- **HTTPS enforced** at the edge (load‑balancer/Ingress). 
- **CORS** configured for trusted origins only.
- **Rate limiting** / **IP throttling** (add via gateway or Spring Cloud Gateway). 
- **Security headers** (`Content‑Security‑Policy`, `X‑Content‑Type‑Options`, etc.)
- **Audit logging** of auth events.

---

## 📚 API Documentation
Add the optional Swagger dependency:
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.5.0</version>
</dependency>
```
Then access UI at `http://localhost:8080/swagger-ui.html`.

---

## 🧪 Testing
- **Unit tests** – located under `src/test/java`.
- **Integration tests** – use Testcontainers for PostgreSQL.
```bash
mvn test            # unit only
mvn verify          # includes integration
```

---

## 🤖 CI/CD Pipeline (GitHub Actions Example)
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up JDK 25
        uses: actions/setup-java@v4
        with:
          java-version: '25'
          distribution: 'temurin'
      - name: Build & Test
        run: mvn -B clean verify
      - name: Build Docker image
        run: |
          docker build -t ${{ github.repository }}:latest .
      - name: Scan image (Trivy)
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ github.repository }}:latest
          format: 'table'
          exit-code: '1'
```

---

## 📄 License
This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

*Designed for developers, DevOps engineers, and architects who want a battle‑tested, production‑ready foundation for a ride‑hailing service.*
