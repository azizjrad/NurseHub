#!/bin/bash

echo "🏥 NurseHub Setup Script"
echo "========================"
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "✅ .env file found"
else
    echo "⚠️  Creating .env from .env.example..."
    cp .env.example .env
    echo "❗ Please edit .env file with your configuration before continuing!"
    echo ""
    echo "Required configurations:"
    echo "  - DATABASE_URL (PostgreSQL connection)"
    echo "  - NEXTAUTH_SECRET (run: openssl rand -base64 32)"
    echo "  - ADMIN_EMAIL and ADMIN_PASSWORD"
    echo "  - Email SMTP settings"
    echo ""
    read -p "Press Enter when ready to continue or Ctrl+C to exit"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Generate Prisma Client
echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

# Push database schema
echo ""
echo "🗄️  Pushing database schema..."
npx prisma db push

if [ $? -ne 0 ]; then
    echo "❌ Failed to push database schema"
    echo "⚠️  Make sure PostgreSQL is running and DATABASE_URL is correct"
    exit 1
fi

# Seed database
echo ""
echo "🌱 Seeding database with admin user..."
npm run db:seed

if [ $? -ne 0 ]; then
    echo "⚠️  Failed to seed database, you may need to create admin manually"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run: npm run dev"
echo "  2. Visit: http://localhost:3000"
echo "  3. Admin login: http://localhost:3000/admin/login"
echo ""
echo "📚 Check README.md for more information"
