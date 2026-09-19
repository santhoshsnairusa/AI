#!/bin/bash

# ===================================================
# NexAware Home AI Application Starter (Mac/Linux)
# ===================================================

echo -e "\033[0;36m===================================================\033[0m"
echo -e "\033[0;36m  NexAware Home AI Application Starter\033[0m"
echo -e "\033[0;36m===================================================\033[0m"
echo ""

echo -e "\033[0;33m[1/3] Stopping any currently running containers...\033[0m"
docker compose down

echo ""
echo -e "\033[0;33m[2/3] Building and starting all services (Database, API, UI, Worker)...\033[0m"
docker compose up -d --build

echo ""
echo -e "\033[0;32m✅ [3/3] NexAware Home AI is now running!\033[0m"
echo -e "\033[0;36m===================================================\033[0m"
echo "Web Interface: http://localhost:8085"
echo "Setup Page:    http://localhost:8085/setup"
echo -e "\033[0;36m===================================================\033[0m"
