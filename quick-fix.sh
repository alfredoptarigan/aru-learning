#!/bin/bash

# ===================================================
# ARU Learning - Quick Fix Script
# ===================================================
# This script fixes common deployment issues
# Run this on your server when encountering errors
# ===================================================

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 ARU Learning - Quick Fix Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if running in correct directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found!"
    echo "   Please run this script from /var/www/aru-learning directory"
    exit 1
fi

echo "✅ Found docker-compose.yml"
echo ""

# Step 1: Check .env file
echo "📝 Step 1: Checking .env file..."
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found! Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  IMPORTANT: Please edit .env file with your actual values!"
    echo ""
    echo "Opening nano editor for you..."
    nano .env
else
    echo "✅ .env file exists"
    echo ""
    read -p "Do you want to edit .env file? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        nano .env
    fi
fi
echo ""

# Step 2: Check APP_KEY
echo "🔑 Step 2: Checking APP_KEY..."
if grep -q "APP_KEY=$" .env || grep -q "APP_KEY=\"\"" .env; then
    echo "⚠️  APP_KEY is empty (this is OK - will be auto-generated)"
else
    echo "✅ APP_KEY is set"
fi
echo ""

# Step 3: Stop containers
echo "🛑 Step 3: Stopping containers..."
docker compose down
echo "✅ Containers stopped"
echo ""

# Step 4: Rebuild images
echo "🔨 Step 4: Rebuilding Docker images (this may take 5-10 minutes)..."
docker compose build --no-cache
echo "✅ Images rebuilt"
echo ""

# Step 5: Start containers
echo "🚀 Step 5: Starting containers..."
docker compose up -d
echo "✅ Containers started"
echo ""

# Step 6: Wait for services
echo "⏳ Step 6: Waiting for services to be ready..."
sleep 15
echo "✅ Services should be ready"
echo ""

# Step 7: Check container status
echo "📊 Step 7: Checking container status..."
docker compose ps
echo ""

# Step 8: Verify APP_KEY
echo "🔑 Step 8: Verifying APP_KEY..."
if docker compose exec -T app grep "APP_KEY=base64:" .env > /dev/null 2>&1; then
    echo "✅ APP_KEY is set correctly"
else
    echo "⚠️  APP_KEY not set, generating now..."
    docker compose exec app php artisan key:generate --force
    echo "✅ APP_KEY generated"
fi
echo ""

# Step 9: Test database connection
echo "🗄️  Step 9: Testing database connection..."
if docker compose exec -T app php artisan db:monitor > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "⚠️  Database connection failed, waiting longer..."
    sleep 10
    if docker compose exec -T app php artisan db:monitor > /dev/null 2>&1; then
        echo "✅ Database connection successful"
    else
        echo "❌ Database connection still failing"
        echo "   Check logs: docker compose logs postgres"
    fi
fi
echo ""

# Step 10: Fix permissions
echo "🔐 Step 10: Fixing file permissions..."
docker compose exec -u root app chown -R www-data:www-data storage bootstrap/cache
docker compose exec -u root app chmod -R 775 storage bootstrap/cache
echo "✅ Permissions fixed"
echo ""

# Step 11: Show logs
echo "📋 Step 11: Checking recent logs..."
docker compose logs --tail=20 app
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Quick fix completed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Check if all containers are running: docker compose ps"
echo "2. View logs: docker compose logs -f"
echo "3. Test in browser: https://aru-learning.alfredoptarigan.tech"
echo ""
echo "If you still have issues, check TROUBLESHOOTING.md"
echo ""
