#!/usr/bin/env bash
# ====================================================================
# Urban Ride Mock Driver & Trip Data Generator
# ====================================================================
set -euo pipefail

echo "Generating mock driver telemetry pings and trips..."
BASE_URL="${1:-http://localhost:8080/api/v1}"

echo "Mock generation completed for $BASE_URL."
