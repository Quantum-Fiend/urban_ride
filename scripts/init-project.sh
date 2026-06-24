#!/bin/bash
echo "Initializing Urban Ride Project Environment..."
docker compose down -v
docker compose build
echo "Initialization complete! Run 'docker compose up -d' to start the services."
