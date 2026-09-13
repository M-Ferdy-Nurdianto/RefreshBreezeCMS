@echo off
setlocal enabledelayedexpansion

echo ==============================================
echo       Starting Refresh Breeze Local Dev
echo ==============================================
echo.

echo [1/4] Checking Dependencies...
if not exist "node_modules\" (
    echo Installing root dependencies...
    call npm install
)
if not exist "frontend\node_modules\" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)
if not exist "backend\node_modules\" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

echo.
echo [2/5] Checking Docker Status...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker daemon is not running. Starting Docker Desktop...
    if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
        start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    ) else (
        start "" docker
    )
    echo Waiting for Docker to start...
    :wait_docker
    timeout /t 3 /nobreak >nul
    docker info >nul 2>&1
    if %errorlevel% neq 0 (
        echo Still waiting for Docker engine to be ready...
        goto wait_docker
    )
    echo Docker engine is ready!
) else (
    echo Docker is already running.
)

echo.
echo [3/5] Starting Supabase Local Environment...
call npx supabase start
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start Supabase. Please check Docker and try again.
    pause
    exit /b %errorlevel%
)

echo.
echo [4/5] Starting Web Development Server (Frontend ^& Backend)...
:: Start the servers in a new console window so it doesn't block this script
start "Refresh Breeze Servers" cmd /k "npm run dev"

echo.
echo [5/5] Opening Web and Database in Default Browser...
:: Wait 5 seconds to let the frontend server start
timeout /t 5 /nobreak >nul

:: Buka di browser bawaan / default Windows
start "" "http://localhost:3000"
start "" "http://127.0.0.1:54323"

echo.
echo All services started successfully!
echo You can close this window.
pause
