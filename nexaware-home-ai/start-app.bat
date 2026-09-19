@echo off
echo ===================================================
echo   NexAware Home AI Application Starter
echo ===================================================
echo.

echo [1/3] Stopping any currently running containers...
docker compose down

echo.
echo [2/3] Building and starting all services (Database, API, UI, Worker)...
docker compose up -d --build

echo.
echo [3/3] NexAware Home AI is now running!
echo ===================================================
echo Web Interface: http://localhost:8085
echo Setup Page:    http://localhost:8085/setup
echo ===================================================
pause
