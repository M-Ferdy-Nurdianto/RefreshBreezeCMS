@echo off
setlocal enabledelayedexpansion

:: ======================================================
:: REFRESH BREEZE - STABLE LAUNCHER v2.3
:: ======================================================

:: Force UTF-8 for better symbols
chcp 65001 >nul

:: Window setup
title Refresh Breeze Studio
mode con: cols=100 lines=30
cls

echo.
echo  [SYSTEM] Initializing...
echo.

:: --- [1] CHECKS ---
echo  [STEP 1] Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo.
    echo  [!] ERROR: Node.js not found.
    echo      Please install from: https://nodejs.org
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do set NODE_VERSION=%%v
echo  [+] Node Engine: !NODE_VERSION!
echo.

:: --- [2] SYNC ---
echo  [STEP 2] Checking Dependencies...
set NEED_INSTALL=0
if not exist "node_modules\" set NEED_INSTALL=1
if not exist "frontend\node_modules\" set NEED_INSTALL=1
if not exist "backend\node_modules\" set NEED_INSTALL=1

if !NEED_INSTALL! equ 1 (
    echo  [*] Modules missing. Installing dependencies...
    echo      (This may take a few minutes...)
    echo.
    
    echo  - Installing Core...
    call npm install --silent
    
    echo  - Installing Frontend...
    cd frontend
    call npm install --silent
    cd ..
    
    echo  - Installing Backend...
    cd backend
    call npm install --silent
    cd ..
    
    echo.
    echo  [+] Installation complete.
) else (
    echo  [+] Dependencies are up to date.
)
echo.

:: --- [3] CONFIG ---
echo  [STEP 3] Verifying Config (.env)...
if exist "frontend\.env.example" if not exist "frontend\.env" (
    copy "frontend\.env.example" "frontend\.env" >nul
    echo  [+] Created: frontend/.env
)
if exist "backend\.env.example" if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env" >nul
    echo  [+] Created: backend/.env
)
echo  [+] Config check done.
echo.

:: --- [4] BROWSER ---
echo  [STEP 4] Opening Browser...
echo  [*] Target: http://localhost:3000
start "" "http://localhost:3000"

:: --- [5] STARTUP ---
echo.
echo  ==================================================
echo   REFRESH BREEZE ENGINE IS STARTING...
echo  ==================================================
echo   FRONTEND : http://localhost:3000
echo   BACKEND  : http://localhost:5000
echo  --------------------------------------------------
echo   Press [CTRL+C] to stop the server.
echo  ==================================================
echo.

:: Start the project
call npm run dev

if %ERRORLEVEL% neq 0 (
    echo.
    echo  [!] ENGINE STOPPED OR CRASHED.
    echo.
    pause
    exit /b 1
)

echo.
echo  [✔] Shutdown complete.
pause
exit /b 0
