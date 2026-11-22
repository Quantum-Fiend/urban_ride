#!/usr/bin/env bash
set -euo pipefail
echo "Deploying Urban Ride containers..."
docker compose up --build -d
