@echo off
echo ==============================================
echo       Starting Refresh Breeze Local Dev
echo ==============================================

echo.
echo [1/2] Starting Supabase Local Environment...
call npx supabase start
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start Supabase. Please check Docker and try again.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Starting Web Development Server (Frontend & Backend)...
call npm run dev
