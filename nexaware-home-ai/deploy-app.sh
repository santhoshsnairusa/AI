#!/bin/bash

# exit immediately if a command fails
set -e 

echo -e "\033[0;36m===================================================\033[0m"
echo -e "\033[0;36m  NexAware Home AI Deployment Script\033[0m"
echo -e "\033[0;36m===================================================\033[0m"
echo ""

# 1. Prompt for git branch
read -p "Enter the branch name to deploy (Press Enter to default to 'main'): " branchName
if [ -z "$branchName" ]; then
    branchName="main"
fi

gitUrl="https://github.com/santhoshsnairusa/AI.git"

# 2. Pull latest code from Git
echo ""
echo -e "\033[0;33m[1/4] Fetching and pulling latest code ($gitUrl) for branch: $branchName...\033[0m"

# disable 'set -e' briefly to gracefully handle fetch/checkout errors
set +e
git fetch $gitUrl
git checkout $branchName
if [ $? -ne 0 ]; then
    echo -e "\033[0;31m❌ Error checking out branch '$branchName'. Aborting deploy.\033[0m"
    exit 1
fi
git pull $gitUrl $branchName
if [ $? -ne 0 ]; then
    echo -e "\033[0;31m❌ Error pulling latest code. Aborting deploy.\033[0m"
    exit 1
fi
set -e

# 3. Run Unit Tests
echo ""
echo -e "\033[0;33m[2/4] Running Unit Tests...\033[0m"
set +e
dotnet test NexAware.HomeAI.slnx
if [ $? -ne 0 ]; then
    echo ""
    echo -e "\033[0;31m❌ Unit tests failed! Deployment has been aborted to prevent breaking the environment.\033[0m"
    exit 1
fi
set -e
echo -e "\033[0;32m✅ Unit tests passed successfully!\033[0m"

# 4. Stop Containers
echo ""
echo -e "\033[0;33m[3/4] Stopping any currently running containers...\033[0m"
docker compose down

# 5. Start Containers
echo ""
echo -e "\033[0;33m[4/4] Building and starting all services with latest code...\033[0m"
docker compose up -d --build

echo ""
echo -e "\033[0;36m===================================================\033[0m"
echo -e "\033[0;32m🚀 Deployment Successful for branch: $branchName\033[0m"
echo "Web Interface: http://localhost:8085"
echo "Setup Page:    http://localhost:8085/setup"
echo -e "\033[0;36m===================================================\033[0m"
