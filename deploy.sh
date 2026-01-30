#!/bin/bash

set -e

echo "🚀 Deploying ARU Learning to Production Server"
echo "================================================"
echo ""

# Check if running on server
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    exit 1
fi

echo "📋 Pre-deployment checklist:"
echo "   1. DNS aru-learning.alfredoptarigan.tech → 165.232.164.234"
echo "   2. Firewall allows ports 80 & 443"
echo "   3. Docker & Docker Compose installed"
echo ""

read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo "🔄 Pulling latest changes..."
git pull origin main || echo "⚠️  Skip if not using git"

echo ""
echo "🏗️  Building Docker images..."
docker compose build --no-cache

echo ""
echo "🛑 Stopping old containers..."
docker compose down

echo ""
echo "🚀 Starting services..."
docker compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

echo ""
echo "📊 Container status:"
docker compose ps

echo ""
echo "🔍 Checking Traefik logs for certificate..."
docker compose logs traefik | grep -i "certificate" | tail -5 || echo "No certificate logs yet"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Check if domain resolves: nslookup aru-learning.alfredoptarigan.tech"
echo "   2. Test HTTP: curl -I http://aru-learning.alfredoptarigan.tech"
echo "   3. Test HTTPS: curl -I https://aru-learning.alfredoptarigan.tech"
echo "   4. View logs: docker compose logs -f"
echo ""
echo "🔑 Let's Encrypt will auto-provision certificate on first HTTPS request"
echo "   Certificate storage: /var/lib/docker/volumes/aru-learning_traefik_certs"
