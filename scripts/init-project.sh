#!/usr/bin/env bash
# ====================================================================
# Urban Ride (RideSphere) Project Initialization Script
# ====================================================================
set -euo pipefail

echo "=========================================="
echo "Initializing Urban Ride (RideSphere)..."
echo "=========================================="

# Check Docker
if command -v docker >/dev/null 2>&1; then
    echo "Docker detected."
else
    echo "Warning: Docker is not installed or not in PATH."
fi

# Check Node.js
if command -v node >/dev/null 2>&1; then
    echo "Node.js $(node -v) detected."
else
    echo "Warning: Node.js is not installed."
fi

# Create required log and data directories
mkdir -p .logs backend/urban-ride/target frontend/node_modules

echo "Spinning up core infra containers (PostgreSQL, Redis)..."
docker compose up -d postgres redis

echo "Urban Ride initialized successfully."
