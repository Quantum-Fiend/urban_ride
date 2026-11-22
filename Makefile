.PHONY: help build test clean docker-up docker-down db-init run-backend run-frontend dev

MVN ?= ./mvnw
DOCKER_COMPOSE ?= docker compose

help:
	@echo "Urban Ride (RideSphere) Enterprise Engineering Commands:"
	@echo "  make build         - Package Spring Boot backend JAR"
	@echo "  make test          - Run backend unit and integration tests"
	@echo "  make clean         - Clean Maven targets and build artifacts"
	@echo "  make docker-up     - Start PostgreSQL, Redis, Kafka, and containers"
	@echo "  make docker-down   - Terminate all Docker Compose containers"
	@echo "  make db-init       - Initialize and seed PostgreSQL database schema"
	@echo "  make run-backend   - Run Spring Boot backend locally"
	@echo "  make run-frontend  - Run Next.js 15 frontend in dev mode"

build:
	cd backend/urban-ride && $(MVN) clean package -DskipTests

test:
	cd backend/urban-ride && $(MVN) test

clean:
	cd backend/urban-ride && $(MVN) clean

docker-up:
	$(DOCKER_COMPOSE) up -d

docker-down:
	$(DOCKER_COMPOSE) down

db-init:
	$(DOCKER_COMPOSE) up -d postgres
	sleep 3
	$(DOCKER_COMPOSE) exec -T postgres psql -U urban_admin -d urban_ride < database/postgresql/init.sql

run-backend:
	cd backend/urban-ride && $(MVN) spring-boot:run

run-frontend:
	cd frontend && npm run dev
