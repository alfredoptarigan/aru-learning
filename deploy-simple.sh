#!/bin/bash

set -e

echo "🚀 Simple Nginx + Certbot Deployment"
echo "======================================"
echo ""

DOMAIN="aru-learning.alfredoptarigan.tech"
EMAIL="alfredoptarigan@tech.com"

# Step 1: Check prerequisites
echo "1️⃣ Checking prerequisites..."
echo ""

echo "Checking DNS..."
IP=$(nslookup $DOMAIN 2>/dev/null | grep "Address:" | tail -1 | awk '{print $2}')
if [ -z "$IP" ]; then
    echo "⚠️  WARNING: Cannot resolve $DOMAIN"
    echo "   Please setup DNS A record first!"
    read -p "   Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ DNS resolves to: $IP"
fi

echo ""
echo "Checking .env file..."
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    exit 1
fi
echo "✅ .env file exists"

echo ""
read -p "Deploy with this configuration? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Step 2: Use simple docker-compose
echo ""
echo "2️⃣ Using simplified docker-compose..."
if [ -f "docker-compose.simple.yml" ]; then
    cp docker-compose.simple.yml docker-compose.yml
    echo "✅ Using docker-compose without Traefik"
else
    echo "❌ docker-compose.simple.yml not found!"
    exit 1
fi

# Step 3: Start with HTTP-only first
echo ""
echo "3️⃣ Starting with HTTP-only configuration..."
echo ""

# Use HTTP-only config
if [ -f "docker/nginx/conf.d/app.conf" ]; then
    mv docker/nginx/conf.d/app.conf docker/nginx/conf.d/app.conf.ssl-backup
fi
echo "✅ Using HTTP-only config for initial setup"

# Build and start
echo ""
echo "4️⃣ Building and starting containers..."
docker compose down
docker compose build --no-cache app
docker compose up -d nginx app postgres redis

echo ""
echo "5️⃣ Waiting for services to start (30s)..."
sleep 30

echo ""
echo "6️⃣ Checking container status..."
docker compose ps

echo ""
echo "7️⃣ Testing HTTP access..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ]; then
    echo "✅ HTTP working! (Status: $HTTP_CODE)"
else
    echo "⚠️  HTTP returned: $HTTP_CODE"
    echo "Checking Nginx logs..."
    docker compose logs --tail=20 nginx
    read -p "Continue with SSL setup? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 8: Get SSL certificate
echo ""
echo "8️⃣ Obtaining SSL certificate..."
echo ""

# Run certbot
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

if [ $? -eq 0 ]; then
    echo "✅ SSL certificate obtained!"
else
    echo "❌ Failed to obtain SSL certificate"
    echo ""
    echo "Common issues:"
    echo "- DNS not pointing to this server"
    echo "- Port 80 not accessible"
    echo "- Domain already has certificate"
    exit 1
fi

# Step 9: Switch to HTTPS config
echo ""
echo "9️⃣ Switching to HTTPS configuration..."

# Restore SSL config
if [ -f "docker/nginx/conf.d/app.conf.ssl-backup" ]; then
    mv docker/nginx/conf.d/app.conf.ssl-backup docker/nginx/conf.d/app.conf
fi

# Remove HTTP-only config
rm -f docker/nginx/conf.d/app-http-only.conf

# Start certbot for auto-renewal
docker compose up -d certbot

# Reload Nginx
docker compose restart nginx

echo ""
echo "🔟 Final verification..."
sleep 5

echo ""
echo "Testing HTTPS..."
HTTPS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN 2>/dev/null || echo "000")
if [ "$HTTPS_CODE" = "200" ] || [ "$HTTPS_CODE" = "302" ]; then
    echo "✅ HTTPS working! (Status: $HTTPS_CODE)"
else
    echo "⚠️  HTTPS returned: $HTTPS_CODE"
    docker compose logs --tail=30 nginx
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deployment Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Your site: https://$DOMAIN"
echo ""
echo "📋 Useful commands:"
echo "  View logs:    docker compose logs -f [nginx|app]"
echo "  Restart:      docker compose restart [service]"
echo "  SSL renewal:  Automatic every 12h via certbot"
echo ""
echo "🔒 SSL certificate will auto-renew 30 days before expiry"
