# Multi-stage production build for RideSphere Modular Monolith (Spring Boot)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and download dependencies
COPY backend/urban-ride/pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build jar
COPY backend/urban-ride/src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root system user
RUN addgroup -S ridesphere && adduser -S ridesphere -G ridesphere
USER ridesphere

COPY --from=build /app/target/urban-ride-*.jar app.jar

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
