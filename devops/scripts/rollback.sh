#!/usr/bin/env bash
set -euo pipefail
echo "Rolling back deployment..."
docker compose down
