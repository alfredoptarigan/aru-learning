#!/bin/bash

set -e

echo "🔧 Quick Fix - Public Folder Sharing"
echo "======================================"
echo ""
echo "Solution: Use shared volume + copy on startup"
echo ""

read -p "Deploy fix now? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo "🛑 Stopping containers..."
docker compose down

echo ""
echo "🗑️  Removing old public volume..."
docker volume rm aru-learning_app_public 2>/dev/null || echo "   No old volume to remove"

echo ""
echo "🏗️  Rebuilding app container..."
docker compose build --no-cache app

echo ""
echo "🚀 Starting services..."
docker compose up -d

echo ""
echo "⏳ Waiting for services (30s)..."
sleep 30

echo ""
echo "🔍 Verifying public folder..."
docker compose exec aru-learning-nginx ls -la /var/www/html/public/ 2>/dev/null | head -15

echo ""
echo "🔍 Checking index.php..."
if docker compose exec aru-learning-nginx test -f /var/www/html/public/index.php 2>/dev/null; then
    echo "✅ index.php found!"
else
    echo "❌ index.php NOT found"
    echo ""
    echo "Checking app container public folder:"
    docker compose exec aru-learning-app ls -la /var/www/html/public/ | head -10
fi

echo ""
echo "🔍 Checking Vite build folder..."
if docker compose exec aru-learning-nginx ls /var/www/html/public/build/ 2>/dev/null >/dev/null; then
    echo "✅ Vite assets found!"
    docker compose exec aru-learning-nginx ls /var/www/html/public/build/ | head -5
else
    echo "❌ Vite assets NOT found"
fi

echo ""
echo "📊 Container status:"
docker compose ps

echo ""
echo "📝 Recent app logs:"
docker compose logs --tail=20 app

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Test: curl -I https://aru-learning.alfredoptarigan.tech"
