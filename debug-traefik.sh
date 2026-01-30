#!/bin/bash

echo "🔍 Traefik Routing Diagnostic"
echo "=============================="
echo ""

echo "1️⃣ Checking Traefik is running..."
if docker compose ps traefik | grep -q "Up"; then
    echo "✅ Traefik is running"
else
    echo "❌ Traefik is NOT running!"
    exit 1
fi
echo ""

echo "2️⃣ Checking Nginx is running..."
if docker compose ps nginx | grep -q "Up"; then
    echo "✅ Nginx is running"
else
    echo "❌ Nginx is NOT running!"
    exit 1
fi
echo ""

echo "3️⃣ Checking Traefik labels on Nginx..."
echo "Expected: traefik.enable=true and router pointing to port 80"
docker inspect aru-learning-nginx 2>/dev/null | jq -r '.[] | .Config.Labels | to_entries[] | select(.key | startswith("traefik")) | "\(.key)=\(.value)"' 2>/dev/null || {
    echo "Using grep instead of jq:"
    docker inspect aru-learning-nginx 2>/dev/null | grep "traefik\." | sed 's/^ *"//;s/": /=/;s/",$//' | head -20
}
echo ""

echo "4️⃣ Checking if Traefik can reach Nginx..."
docker compose exec aru-learning-traefik ping -c 2 aru-learning-nginx 2>/dev/null && echo "✅ Ping successful" || echo "❌ Ping failed"
echo ""

echo "5️⃣ Testing HTTP request from Traefik to Nginx..."
response=$(docker compose exec aru-learning-traefik wget -qO- --timeout=3 http://aru-learning-nginx 2>&1)
if [ $? -eq 0 ]; then
    echo "✅ HTTP request successful!"
    echo "Response (first 200 chars):"
    echo "$response" | head -c 200
    echo ""
else
    echo "❌ HTTP request failed!"
    echo "Error: $response"
fi
echo ""

echo "6️⃣ Checking Traefik logs for errors..."
echo "Recent errors:"
docker compose logs --tail=100 traefik 2>&1 | grep -i -E "(error|fail|refuse|404)" | tail -10 || echo "✅ No errors found"
echo ""

echo "7️⃣ Checking which routers Traefik detected..."
echo "Looking for router creation logs:"
docker compose logs traefik 2>&1 | grep -i "router\|service" | grep -v "acme" | tail -15 || echo "No router logs found"
echo ""

echo "8️⃣ Testing Nginx directly (bypass Traefik)..."
echo "Test from host to Nginx on internal network:"
docker compose exec aru-learning-nginx wget -qO- http://localhost 2>&1 | head -c 200 && echo "" || echo "❌ Nginx not responding on localhost"
echo ""

echo "9️⃣ Checking Traefik network..."
echo "Traefik network settings:"
docker inspect aru-learning-traefik 2>/dev/null | grep -A 30 "Networks" | head -35
echo ""

echo "🔟 Quick fix suggestions..."
echo ""
echo "If Nginx is healthy but Traefik can't route:"
echo ""
echo "Option 1 - Restart Traefik to reload labels:"
echo "  docker compose restart traefik"
echo ""
echo "Option 2 - Recreate containers to reapply labels:"
echo "  docker compose up -d --force-recreate nginx traefik"
echo ""
echo "Option 3 - Check if old container still registered:"
echo "  docker ps -a | grep aru-learning"
echo "  docker rm -f <old-container-id>"
echo ""
echo "================================"
echo "✅ Diagnostic complete!"
echo ""
echo "Next: Run suggested fix and test:"
echo "  curl -I https://aru-learning.alfredoptarigan.tech"
