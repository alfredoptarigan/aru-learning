#!/bin/bash
set -e

DOMAIN="aru-learning.alfredoptarigan.tech"
EMAIL="alfredoptarigan@tech.com"

echo "🚀 ARU Learning - Deployment Script"
echo "===================================="
echo ""

# Check .env
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "   Run: cp .env.example .env && nano .env"
    exit 1
fi

# Parse command
case "$1" in
    # =========================================
    # Initial setup (HTTP only, get SSL cert)
    # =========================================
    init)
        echo "📋 Step 1: Starting with HTTP-only..."
        
        # Use HTTP-only config
        cp docker/nginx/default-http.conf docker/nginx/default.conf
        
        # Build and start
        docker compose build app
        docker compose up -d app postgres redis nginx
        
        echo ""
        echo "⏳ Waiting 30 seconds for services..."
        sleep 30
        
        echo ""
        echo "📋 Step 2: Testing HTTP..."
        if curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN | grep -q "200\|302"; then
            echo "✅ HTTP working!"
        else
            echo "⚠️  HTTP may not be ready, checking logs..."
            docker compose logs --tail=20 nginx
        fi
        
        echo ""
        echo "📋 Step 3: Getting SSL certificate..."
        docker compose run --rm certbot certonly \
            --webroot \
            --webroot-path=/var/www/certbot \
            --email $EMAIL \
            --agree-tos \
            --no-eff-email \
            -d $DOMAIN
        
        echo ""
        echo "📋 Step 4: Switching to HTTPS config..."
        cat > docker/nginx/default.conf << 'NGINXCONF'
server {
    listen 80;
    server_name aru-learning.alfredoptarigan.tech _;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://$host$request_uri; }
}

server {
    listen 443 ssl http2;
    server_name aru-learning.alfredoptarigan.tech _;
    root /var/www/html/public;
    index index.php;

    ssl_certificate /etc/letsencrypt/live/aru-learning.alfredoptarigan.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aru-learning.alfredoptarigan.tech/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Strict-Transport-Security "max-age=31536000" always;

    client_max_body_size 100M;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;

    location / { try_files $uri $uri/ /index.php?$query_string; }
    location ~ \.php$ {
        fastcgi_pass aru-learning-app:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 180;
    }
    location ~ /\. { deny all; }
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2)$ { expires 30d; }
}
NGINXCONF
        
        # Start certbot for auto-renewal
        docker compose up -d certbot
        docker compose restart nginx
        
        echo ""
        echo "✅ Deployment complete!"
        echo "🌐 https://$DOMAIN"
        ;;

    # =========================================
    # Update deployment
    # =========================================
    update)
        echo "🔄 Updating deployment..."
        git pull origin main
        docker compose build app
        docker compose up -d
        echo "✅ Updated!"
        ;;

    # =========================================
    # Start services
    # =========================================
    start)
        echo "▶️  Starting services..."
        docker compose up -d
        echo "✅ Started!"
        docker compose ps
        ;;

    # =========================================
    # Stop services
    # =========================================
    stop)
        echo "⏹️  Stopping services..."
        docker compose down
        echo "✅ Stopped!"
        ;;

    # =========================================
    # View logs
    # =========================================
    logs)
        docker compose logs -f ${2:-}
        ;;

    # =========================================
    # Status
    # =========================================
    status)
        docker compose ps
        ;;

    # =========================================
    # Renew SSL certificate
    # =========================================
    renew-ssl)
        echo "🔒 Renewing SSL certificate..."
        docker compose run --rm certbot renew
        docker compose restart nginx
        echo "✅ Done!"
        ;;

    # =========================================
    # Run artisan command
    # =========================================
    artisan)
        shift
        docker compose exec app php artisan "$@"
        ;;

    # =========================================
    # Help
    # =========================================
    *)
        echo "Usage: ./deploy.sh [command]"
        echo ""
        echo "Commands:"
        echo "  init       - Initial deployment (get SSL, start services)"
        echo "  update     - Pull changes and rebuild"
        echo "  start      - Start all services"
        echo "  stop       - Stop all services"
        echo "  status     - Show container status"
        echo "  logs       - View logs (optional: service name)"
        echo "  renew-ssl  - Manually renew SSL certificate"
        echo "  artisan    - Run artisan command"
        echo ""
        echo "Examples:"
        echo "  ./deploy.sh init"
        echo "  ./deploy.sh logs nginx"
        echo "  ./deploy.sh artisan migrate"
        ;;
esac
