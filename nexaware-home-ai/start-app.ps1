# start-app.ps1
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  NexAware Home AI Application Starter" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Stopping any currently running containers..." -ForegroundColor Yellow
docker compose down

Write-Host ""
Write-Host "[2/3] Building and starting all services (Database, API, UI, Worker)..." -ForegroundColor Yellow
docker compose up -d --build

Write-Host ""
Write-Host "[3/3] NexAware Home AI is now running!" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Web Interface: http://localhost:8085"
Write-Host "Setup Page:    http://localhost:8085/setup"
Write-Host "===================================================" -ForegroundColor Cyan
