# DataPilot Full-Stack Launcher (Backend API + React Frontend)
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Starting DataPilot Enterprise 2.0" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Start FastAPI backend in a separate terminal window
Write-Host "[1/2] Launching Backend API (http://localhost:8001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting DataPilot Backend API...' -ForegroundColor Cyan; myenv\Scripts\python.exe api_server.py"

Start-Sleep -Seconds 2

# 2. Start Vite React frontend in current terminal
Write-Host "[2/2] Launching Frontend Dev Server (http://localhost:5173)..." -ForegroundColor Green
Set-Location datapilot-frontend
npm run dev

