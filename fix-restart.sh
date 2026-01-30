#!/bin/bash

# ===================================================
# Fix Container Restart Loop
# ===================================================
# Use this when container keeps restarting
# ===================================================

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Fixing Container Restart Loop"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if running in correct directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found!"
    exit 1
fi

# Step 1: Force stop all containers
echo "🛑 Step 1: Force stopping all containers..."
docker compose down --remove-orphans
docker compose rm -f
echo "✅ All containers stopped and removed"
echo ""

# Step 2: Check what caused the restart
echo "🔍 Step 2: Checking previous container logs..."
echo ""
echo "Looking for recent errors in app container logs:"
docker compose logs --tail=50 app 2>&1 | grep -i -E "(error|exception|failed|fatal)" || echo "No obvious error messages found"
echo ""

# Step 3: Check if .env exists
echo "📋 Step 3: Checking .env file..."
if [ ! -f ".env" ]; then
    echo "❌ .env file NOT found! Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: You need to edit .env file!"
    nano .env
else
    echo "✅ .env file exists"
    echo "   Checking required values..."

    # Check if DB_PASSWORD is set
    if grep -q "^DB_PASSWORD=.*$" .env && ! grep -q "^DB_PASSWORD=$" .env; then
        echo "   ✅ DB_PASSWORD is set"
    else
        echo "   ⚠️  DB_PASSWORD is empty or not set"
    fi
fi
echo ""

# Step 4: Clean up Docker system
echo "🗑️  Step 4: Cleaning up Docker system..."
docker system prune -f --volumes
echo "✅ Docker system cleaned"
echo ""

# Step 5: Build images from scratch
echo "🔨 Step 5: Rebuilding Docker images (this will take 5-10 minutes)..."
docker compose build --no-cache
echo "✅ Images rebuilt"
echo ""

# Step 6: Start ONLY database and redis first
echo "🚀 Step 6: Starting database and Redis..."
docker compose up -d postgres redis
echo "✅ Database and Redis started"
echo ""

# Step 7: Wait for database
echo "⏳ Step 7: Waiting for database to be ready (30 seconds)..."
for i in {1..30}; do
    if docker compose exec -T postgres pg_isready -U laravel > /dev/null 2>&1; then
        echo "✅ Database is ready!"
        break
    fi
    echo "   Waiting... ($i/30)"
    sleep 1
done
echo ""

# Step 8: Start app container
echo "🚀 Step 8: Starting app container..."
docker compose up -d app
echo "✅ App container started"
echo ""

# Step 9: Wait and check logs
echo "⏳ Step 9: Waiting for app to initialize (15 seconds)..."
sleep 15
echo ""

# Step 10: Check app status
echo "📊 Step 10: Checking app container status..."
docker compose ps
echo ""

# Step 11: Show recent logs
echo "📋 Step 11: Showing recent app logs..."
docker compose logs --tail=50 app
echo ""

# Step 12: Check if container is still running
echo "🔍 Step 12: Checking if container is stable..."
sleep 10
if docker compose ps app | grep -q "Up"; then
    echo "✅ App container is stable!"
else
    echo "❌ App container is still having issues"
    echo ""
    echo "Full logs:"
    docker compose logs app
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Fix attempt completed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "If container is still restarting, check:"
echo "1. docker compose logs app"
echo "2. docker compose exec app cat /var/www/html/.env"
echo "3. docker compose exec app php artisan db:monitor"
echo ""
