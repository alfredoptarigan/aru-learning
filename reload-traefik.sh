#!/bin/bash

echo "🔄 Force Traefik to Reload Nginx Labels"
echo "========================================"
echo ""

read -p "This will recreate Traefik and Nginx containers. Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo "1️⃣ Stopping Traefik and Nginx..."
docker compose stop traefik nginx

echo ""
echo "2️⃣ Removing containers (keeps data)..."
docker compose rm -f traefik nginx

echo ""
echo "3️⃣ Recreating containers..."
docker compose up -d traefik nginx

echo ""
echo "4️⃣ Waiting for services to start (15s)..."
sleep 15

echo ""
echo "5️⃣ Checking status..."
docker compose ps traefik nginx

echo ""
echo "6️⃣ Checking Traefik logs..."
docker compose logs --tail=30 traefik | grep -E "(Creating|router|nginx|app)" || echo "No relevant logs"

echo ""
echo "7️⃣ Testing connection..."
echo "From Traefik to Nginx:"
docker compose exec aru-learning-traefik wget -qO- --timeout=3 http://aru-learning-nginx 2>&1 | head -c 100 && echo "" || echo "❌ Cannot reach Nginx"

echo ""
echo "================================"
echo "✅ Reload complete!"
echo ""
echo "Test now:"
echo "  curl -I https://aru-learning.alfredoptarigan.tech"
echo ""
echo "If still 404, run:"
echo "  ./debug-traefik.sh"
