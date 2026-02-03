# Quick Start Script - Refresh Breeze

# Pastikan sudah di folder RB Remake
Write-Host "🚀 Refresh Breeze - Quick Start" -ForegroundColor Green
Write-Host ""

# Check if Node.js installed
Write-Host "Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found! Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Select action:" -ForegroundColor Cyan
Write-Host "1. Install all dependencies (first time setup)"
Write-Host "2. Start development servers"
Write-Host "3. Install frontend only"
Write-Host "4. Install backend only"
Write-Host "5. Build frontend for production"
Write-Host "6. Create .env files from examples"
Write-Host ""

$choice = Read-Host "Enter choice (1-6)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "📦 Installing all dependencies..." -ForegroundColor Yellow
        
        # Root
        Write-Host "Installing root dependencies..." -ForegroundColor Cyan
        npm install
        
        # Frontend
        Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
        Set-Location frontend
        npm install
        Set-Location ..
        
        # Backend
        Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
        Set-Location backend
        npm install
        Set-Location ..
        
        Write-Host ""
        Write-Host "✅ All dependencies installed!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Setup Supabase database (see SETUP.md)"
        Write-Host "2. Setup Google Drive API (see SETUP.md)"
        Write-Host "3. Create .env files (option 6 in this menu)"
        Write-Host "4. Start servers (option 2 in this menu)"
    }
    
    "2" {
        Write-Host ""
        Write-Host "🚀 Starting development servers..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "⚠️  Make sure you have .env files configured!" -ForegroundColor Red
        Write-Host "   Press Ctrl+C to cancel if not ready." -ForegroundColor Red
        Start-Sleep -Seconds 3
        
        Write-Host ""
        Write-Host "Starting backend on http://localhost:5000" -ForegroundColor Cyan
        Write-Host "Starting frontend on http://localhost:3000" -ForegroundColor Cyan
        Write-Host ""
        
        # Start in separate windows or use concurrently
        $hasConc = npm list -g concurrently 2>$null
        if ($hasConc) {
            npm run dev
        } else {
            Write-Host "Option 1: Install concurrently globally" -ForegroundColor Yellow
            Write-Host "npm install -g concurrently" -ForegroundColor Gray
            Write-Host ""
            Write-Host "Option 2: Start manually in separate terminals:" -ForegroundColor Yellow
            Write-Host "Terminal 1: cd backend && npm run dev" -ForegroundColor Gray
            Write-Host "Terminal 2: cd frontend && npm run dev" -ForegroundColor Gray
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
        Set-Location frontend
        npm install
        Set-Location ..
        Write-Host "✅ Frontend dependencies installed!" -ForegroundColor Green
    }
    
    "4" {
        Write-Host ""
        Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
        Set-Location backend
        npm install
        Set-Location ..
        Write-Host "✅ Backend dependencies installed!" -ForegroundColor Green
    }
    
    "5" {
        Write-Host ""
        Write-Host "🏗️  Building frontend for production..." -ForegroundColor Yellow
        Set-Location frontend
        npm run build
        Set-Location ..
        Write-Host ""
        Write-Host "✅ Build complete! Check frontend/dist folder" -ForegroundColor Green
    }
    
    "6" {
        Write-Host ""
        Write-Host "📝 Creating .env files from examples..." -ForegroundColor Yellow
        
        # Frontend
        if (Test-Path "frontend/.env.example") {
            if (-not (Test-Path "frontend/.env")) {
                Copy-Item "frontend/.env.example" "frontend/.env"
                Write-Host "✅ Created frontend/.env" -ForegroundColor Green
                Write-Host "⚠️  Edit frontend/.env with your Supabase credentials!" -ForegroundColor Yellow
            } else {
                Write-Host "⚠️  frontend/.env already exists, skipping..." -ForegroundColor Yellow
            }
        }
        
        # Backend
        if (Test-Path "backend/.env.example") {
            if (-not (Test-Path "backend/.env")) {
                Copy-Item "backend/.env.example" "backend/.env"
                Write-Host "✅ Created backend/.env" -ForegroundColor Green
                Write-Host "⚠️  Edit backend/.env with your credentials!" -ForegroundColor Yellow
            } else {
                Write-Host "⚠️  backend/.env already exists, skipping..." -ForegroundColor Yellow
            }
        }
        
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Edit frontend/.env with Supabase URL & Anon Key"
        Write-Host "2. Edit backend/.env with all credentials"
        Write-Host "3. See SETUP.md for detailed instructions"
    }
    
    default {
        Write-Host "Invalid choice. Exiting." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Done! 🎉" -ForegroundColor Green
Write-Host ""
