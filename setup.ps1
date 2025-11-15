# NurseHub Setup Script

Write-Host "🏥 NurseHub Setup Script" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan

# Check if .env exists
if (Test-Path .env) {
    Write-Host "✅ .env file found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "❗ Please edit .env file with your configuration before continuing!" -ForegroundColor Red
    Write-Host "`nRequired configurations:" -ForegroundColor Yellow
    Write-Host "  - DATABASE_URL (PostgreSQL connection)" -ForegroundColor White
    Write-Host "  - NEXTAUTH_SECRET (run: openssl rand -base64 32)" -ForegroundColor White
    Write-Host "  - ADMIN_EMAIL and ADMIN_PASSWORD" -ForegroundColor White
    Write-Host "  - Email SMTP settings`n" -ForegroundColor White
    
    $continue = Read-Host "Press Enter when ready to continue or Ctrl+C to exit"
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Generate Prisma Client
Write-Host "`n🔧 Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}

# Push database schema
Write-Host "`n🗄️  Pushing database schema..." -ForegroundColor Cyan
npx prisma db push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push database schema" -ForegroundColor Red
    Write-Host "⚠️  Make sure PostgreSQL is running and DATABASE_URL is correct" -ForegroundColor Yellow
    exit 1
}

# Seed database
Write-Host "`n🌱 Seeding database with admin user..." -ForegroundColor Cyan
npm run db:seed

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Failed to seed database, you may need to create admin manually" -ForegroundColor Yellow
}

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Run: npm run dev" -ForegroundColor White
Write-Host "  2. Visit: http://localhost:3000" -ForegroundColor White
Write-Host "  3. Admin login: http://localhost:3000/admin/login`n" -ForegroundColor White
Write-Host "📚 Check README.md for more information" -ForegroundColor Yellow
