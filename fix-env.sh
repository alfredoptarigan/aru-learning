#!/bin/bash

# ===================================================
# Fix .env Not Found Error
# ===================================================
# Run this on your server when .env file is missing
# ===================================================

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Fixing .env Missing File Error"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if running in correct directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found!"
    echo "   Please run this script from /var/www/aru-learning directory"
    exit 1
fi

echo "📍 Current directory: $(pwd)"
echo ""

# Step 1: Check if .env exists
echo "📋 Step 1: Checking if .env file exists..."
if [ -f ".env" ]; then
    echo "✅ .env file found!"
    echo "   Size: $(wc -l < .env) lines"
    echo "   First 5 lines:"
    head -5 .env
else
    echo "❌ .env file NOT found! This is the problem!"
    echo ""
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created from .env.example"
fi
echo ""

# Step 2: Show what needs to be filled in .env
echo "📝 Step 2: Checking required fields in .env..."
echo ""
echo "These fields need to be filled in .env:"
echo ""
grep "=.*$" .env | grep -v "^#" | head -15
echo ""
echo "... (and more)"
echo ""

# Step 3: Ask user to edit .env
read -p "Do you want to edit .env file now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    nano .env
    echo "✅ .env file edited"
fi
echo ""

# Step 4: Stop and remove containers
echo "🛑 Step 3: Stopping containers..."
docker compose down
echo "✅ Containers stopped"
echo ""

# Step 5: Remove old images (force rebuild)
echo "🗑️  Step 4: Removing old images to force rebuild..."
docker compose rm -f
echo "✅ Old images removed"
echo ""

# Step 6: Rebuild images
echo "🔨 Step 5: Rebuilding Docker images (this may take 5-10 minutes)..."
docker compose build --no-cache
echo "✅ Images rebuilt"
echo ""

# Step 7: Start containers
echo "🚀 Step 6: Starting containers..."
docker compose up -d
echo "✅ Containers started"
echo ""

# Step 8: Wait for startup
echo "⏳ Step 7: Waiting for application to start (20 seconds)..."
sleep 20
echo "✅ Wait complete"
echo ""

# Step 9: Check if .env is mounted in container
echo "🔍 Step 8: Verifying .env file in container..."
if docker compose exec -T app test -f /var/www/html/.env; then
    echo "✅ .env file is mounted in container"
    echo "   First 5 lines in container:"
    docker compose exec -T app head -5 /var/www/html/.env
else
    echo "❌ .env file NOT mounted in container!"
    echo "   Checking docker-compose.yml volume mount..."
    grep -A5 "volumes:" docker-compose.yml | head -10
fi
echo ""

# Step 10: Check container status
echo "📊 Step 9: Checking container status..."
docker compose ps
echo ""

# Step 11: Check logs
echo "📋 Step 10: Checking application logs..."
docker compose logs --tail=30 app
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Fix completed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "If you still see the error, check:"
echo "1. docker compose logs app"
echo "2. docker compose exec app ls -la /var/www/html/"
echo ""
