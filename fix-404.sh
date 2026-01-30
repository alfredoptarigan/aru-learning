#!/bin/bash

echo "🔧 Quick Fix - 404 Error"
echo "=========================="
echo ""
echo "Problem: Nginx tidak bisa akses public folder dari app container"
echo "Solution: volumes_from untuk share filesystem"
echo ""

read -p "Deploy fix now? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo "🔄 Rebuilding containers..."
docker compose down
docker compose build --no-cache app
docker compose up -d

echo ""
echo "⏳ Waiting for containers to start..."
sleep 10

echo ""
echo "🔍 Checking Nginx can access public files..."
docker compose exec aru-learning-nginx ls -la /var/www/html/public/ | head -10

echo ""
echo "🔍 Checking index.php exists..."
docker compose exec aru-learning-nginx test -f /var/www/html/public/index.php && echo "✅ index.php found" || echo "❌ index.php not found"

echo ""
echo "🔍 Checking Vite build folder..."
docker compose exec aru-learning-nginx ls /var/www/html/public/build/ 2>/dev/null && echo "✅ Vite assets found" || echo "❌ Vite assets not found"

echo ""
echo "📊 Container status:"
docker compose ps

echo ""
echo "✅ Fix applied!"
echo ""
echo "Test now: curl -I https://aru-learning.alfredoptarigan.tech"
