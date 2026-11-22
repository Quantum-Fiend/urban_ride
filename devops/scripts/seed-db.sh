#!/usr/bin/env bash
set -euo pipefail
echo "Seeding database..."
docker exec -i urban-ride-postgres psql -U urban_admin -d urban_ride < database/postgresql/init.sql
