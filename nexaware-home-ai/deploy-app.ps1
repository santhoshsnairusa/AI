# deploy-app.ps1

$ErrorActionPreference = "Continue"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  NexAware Home AI Deployment Script" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Prompt for git branch
$branchName = Read-Host "Enter the branch name to deploy (Press Enter to default to 'main')"
if ([string]::IsNullOrWhiteSpace($branchName)) {
    $branchName = "main"
}

$gitUrl = "https://github.com/santhoshsnairusa/AI.git"

# 2. Pull latest code from Git
Write-Host "`n[1/4] Fetching and pulling latest code ($gitUrl) for branch: $branchName..." -ForegroundColor Yellow
git fetch $gitUrl
git checkout $branchName
if ($LastExitCode -ne 0 -and $LastExitCode -ne $null) {
    Write-Host "Error checking out branch '$branchName'. Aborting deploy." -ForegroundColor Red
    exit $LastExitCode
}

git pull $gitUrl $branchName
if ($LastExitCode -ne 0 -and $LastExitCode -ne $null) {
    Write-Host "Error pulling latest code from git. Aborting deploy." -ForegroundColor Red
    exit $LastExitCode
}

# 3. Run Unit Tests (C# API/Worker)
Write-Host "`n[2/4] Running Unit Tests..." -ForegroundColor Yellow
# This runs any tests in the tests/ directory against your solution
dotnet test NexAware.HomeAI.slnx
if ($LastExitCode -ne 0 -and $LastExitCode -ne $null) {
    Write-Host ''
    Write-Host "❌ Unit tests failed! Deployment has been aborted to prevent breaking the environment." -ForegroundColor Red
    exit $LastExitCode
}
Write-Host "✅ Unit tests passed successfully!" -ForegroundColor Green

# 4. Stop Containers
Write-Host "`n[3/4] Stopping any currently running containers..." -ForegroundColor Yellow
docker compose down

# 5. Start Containers
Write-Host "`n[4/4] Building and starting all services with latest code..." -ForegroundColor Yellow
docker compose up -d --build

Write-Host "`n===================================================" -ForegroundColor Cyan
Write-Host "🚀 Deployment Successful for branch: $branchName" -ForegroundColor Green
Write-Host "Web Interface: http://localhost:8085"
Write-Host "Setup Page:    http://localhost:8085/setup"
Write-Host "===================================================" -ForegroundColor Cyan
