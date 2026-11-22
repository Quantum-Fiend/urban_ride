#!/usr/bin/env bash
# ====================================================================
# Urban Ride (RideSphere) Database Reset Script
# ====================================================================
set -euo pipefail

echo "Resetting Urban Ride Database..."
docker compose down -v postgres
docker compose up -d postgres

echo "Waiting for PostgreSQL to be ready..."
until docker exec -i urban-ride-postgres pg_isready -U urban_admin -d urban_ride; do
  sleep 1
done

echo "Database reset and seeded successfully!"
