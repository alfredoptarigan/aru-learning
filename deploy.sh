#!/bin/bash
set -e

DOMAIN="aru-learning.alfredoptarigan.tech"
EMAIL="alfredoptarigan@tech.com"

echo "🚀 ARU Learning - Deployment Script"
echo "===================================="
echo ""

# Check .env
check_env() {
    if [ ! -f ".env" ]; then
        echo "❌ .env file not found!"
        echo "   Run: cp .env.example .env && nano .env"
        exit 1
    fi
}

case "$1" in
    # =========================================
    # CLEAN - Remove ALL Docker resources
    # =========================================
    clean)
        echo "🧹 Cleaning ALL Docker resources..."
        echo ""
        echo "⚠️  This will remove:"
        echo "   - All aru-learning containers"
        echo "   - All related volumes (DATABASE WILL BE DELETED)"
        echo "   - All related networks"
        echo "   - Old Traefik containers"
        echo ""
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            echo "Cancelled."
            exit 0
        fi
        
        echo ""
        echo "🛑 Stopping all containers..."
        docker compose down --remove-orphans 2>/dev/null || true
        
        echo ""
        echo "🗑️  Removing old containers (including traefik)..."
        docker rm -f aru-learning-nginx 2>/dev/null || true
        docker rm -f aru-learning-app 2>/dev/null || true
        docker rm -f aru-learning-postgres 2>/dev/null || true
        docker rm -f aru-learning-redis 2>/dev/null || true
        docker rm -f aru-learning-certbot 2>/dev/null || true
        docker rm -f aru-learning-traefik 2>/dev/null || true
        
        echo ""
        echo "🗑️  Removing volumes..."
        docker volume rm aru-learning_postgres_data 2>/dev/null || true
        docker volume rm aru-learning_redis_data 2>/dev/null || true
        docker volume rm aru-learning_certbot_certs 2>/dev/null || true
        docker volume rm aru-learning_certbot_www 2>/dev/null || true
        docker volume rm aru-learning_traefik_certs 2>/dev/null || true
        docker volume rm aru-learning_app_public 2>/dev/null || true
        
        echo ""
        echo "🗑️  Removing networks..."
        docker network rm aru-learning_app_network 2>/dev/null || true
        docker network rm aru-learning_default 2>/dev/null || true
        
        echo ""
        echo "🗑️  Pruning unused Docker resources..."
        docker system prune -f
        
        echo ""
        echo "✅ Clean complete!"
        echo ""
        echo "Next: ./deploy.sh init"
        ;;

    # =========================================
    # INIT - Fresh deployment with SSL
    # =========================================
    init)
        check_env
        
        echo "📋 Starting fresh deployment..."
        echo ""
        
        # Step 1: Use HTTP-only config first
        echo "1️⃣ Setting up HTTP-only config..."
        cp docker/nginx/default-http.conf docker/nginx/default.conf
        
        # Step 2: Build app first
        echo ""
        echo "2️⃣ Building application..."
        docker compose build app
        
        # Step 3: Start database and redis first
        echo ""
        echo "3️⃣ Starting database and redis..."
        docker compose up -d postgres redis
        
        echo ""
        echo "⏳ Waiting for database to be ready (20s)..."
        sleep 20
        
        # Step 4: Start app
        echo ""
        echo "4️⃣ Starting application..."
        docker compose up -d app
        
        echo ""
        echo "⏳ Waiting for app to be ready (30s)..."
        sleep 30
        
        # Check app status
        if ! docker compose ps app | grep -q "Up"; then
            echo "❌ App failed to start!"
            docker compose logs --tail=50 app
            exit 1
        fi
        echo "✅ App is running!"
        
        # Step 5: Start nginx
        echo ""
        echo "5️⃣ Starting nginx..."
        docker compose up -d nginx
        
        sleep 5
        
        # Check nginx status
        if ! docker compose ps nginx | grep -q "Up"; then
            echo "❌ Nginx failed to start!"
            docker compose logs --tail=30 nginx
            exit 1
        fi
        echo "✅ Nginx is running!"
        
        # Step 6: Test HTTP
        echo ""
        echo "6️⃣ Testing HTTP..."
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 http://$DOMAIN 2>/dev/null || echo "000")
        echo "   HTTP response: $HTTP_CODE"
        
        if [ "$HTTP_CODE" = "000" ]; then
            echo "⚠️  Cannot reach domain. Trying localhost..."
            HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost 2>/dev/null || echo "000")
            echo "   Localhost response: $HTTP_CODE"
        fi
        
        if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ] || [ "$HTTP_CODE" = "301" ]; then
            echo "✅ HTTP is working!"
        else
            echo "⚠️  HTTP returned $HTTP_CODE (may still work for SSL)"
        fi
        
        # Step 7: Get SSL certificate
        echo ""
        echo "7️⃣ Getting SSL certificate..."
        echo ""
        
        docker compose run --rm certbot certonly \
            --webroot \
            --webroot-path=/var/www/certbot \
            --email $EMAIL \
            --agree-tos \
            --no-eff-email \
            -d $DOMAIN
        
        if [ $? -ne 0 ]; then
            echo ""
            echo "⚠️  SSL certificate failed. Site will work on HTTP only."
            echo "   You can retry later with: ./deploy.sh setup-ssl"
            echo ""
            echo "📊 Current status:"
            docker compose ps
            exit 0
        fi
        
        echo "✅ SSL certificate obtained!"
        
        # Step 8: Switch to HTTPS config
        echo ""
        echo "8️⃣ Enabling HTTPS..."
        
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
        
        # Start certbot for auto-renewal and restart nginx
        docker compose up -d certbot
        docker compose restart nginx
        
        sleep 5
        
        # Step 9: Final verification
        echo ""
        echo "9️⃣ Final verification..."
        docker compose ps
        
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ Deployment complete!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "🌐 https://$DOMAIN"
        echo ""
        ;;

    # =========================================
    # SETUP-SSL - Get SSL certificate only
    # =========================================
    setup-ssl)
        check_env
        
        echo "🔒 Setting up SSL certificate..."
        
        # Use HTTP config
        cp docker/nginx/default-http.conf docker/nginx/default.conf
        docker compose restart nginx
        sleep 5
        
        # Get certificate
        docker compose run --rm certbot certonly \
            --webroot \
            --webroot-path=/var/www/certbot \
            --email $EMAIL \
            --agree-tos \
            --no-eff-email \
            -d $DOMAIN
        
        if [ $? -eq 0 ]; then
            echo "✅ Certificate obtained!"
            echo "Run: ./deploy.sh enable-ssl"
        else
            echo "❌ Failed to get certificate"
        fi
        ;;

    # =========================================
    # ENABLE-SSL - Switch to HTTPS config
    # =========================================
    enable-ssl)
        echo "🔒 Enabling HTTPS..."
        
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
}
NGINXCONF
        
        docker compose up -d certbot
        docker compose restart nginx
        echo "✅ HTTPS enabled!"
        ;;

    # =========================================
    # UPDATE - Pull and rebuild
    # =========================================
    update)
        check_env
        echo "🔄 Updating deployment..."
        git pull origin main
        docker compose build app
        docker compose up -d
        echo "✅ Updated!"
        ;;

    # =========================================
    # START - Start services
    # =========================================
    start)
        check_env
        echo "▶️  Starting services..."
        docker compose up -d postgres redis
        sleep 10
        docker compose up -d app
        sleep 10
        docker compose up -d nginx certbot
        echo "✅ Started!"
        docker compose ps
        ;;

    # =========================================
    # STOP - Stop services
    # =========================================
    stop)
        echo "⏹️  Stopping services..."
        docker compose down
        echo "✅ Stopped!"
        ;;

    # =========================================
    # RESTART - Restart all
    # =========================================
    restart)
        echo "🔄 Restarting..."
        docker compose restart
        echo "✅ Restarted!"
        docker compose ps
        ;;

    # =========================================
    # LOGS - View logs
    # =========================================
    logs)
        docker compose logs -f ${2:-}
        ;;

    # =========================================
    # STATUS - Show status
    # =========================================
    status)
        echo "📊 Container Status:"
        docker compose ps
        echo ""
        echo "🐳 All aru-learning containers:"
        docker ps -a --filter "name=aru-learning" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        ;;

    # =========================================
    # RENEW-SSL - Renew certificate
    # =========================================
    renew-ssl)
        echo "🔒 Renewing SSL certificate..."
        docker compose run --rm certbot renew
        docker compose restart nginx
        echo "✅ Done!"
        ;;

    # =========================================
    # ARTISAN - Run artisan command
    # =========================================
    artisan)
        shift
        docker compose exec app php artisan "$@"
        ;;

    # =========================================
    # SHELL - Open shell in app container
    # =========================================
    shell)
        docker compose exec app sh
        ;;

    # =========================================
    # HELP
    # =========================================
    *)
        echo "Usage: ./deploy.sh [command]"
        echo ""
        echo "Commands:"
        echo "  clean      - 🧹 Remove ALL containers, volumes, networks (FRESH START)"
        echo "  init       - 🚀 Initial deployment with SSL setup"
        echo "  start      - ▶️  Start all services"
        echo "  stop       - ⏹️  Stop all services"
        echo "  restart    - 🔄 Restart all services"
        echo "  update     - 📥 Pull changes and rebuild"
        echo "  status     - 📊 Show container status"
        echo "  logs       - 📋 View logs (optional: service name)"
        echo "  setup-ssl  - 🔒 Get SSL certificate"
        echo "  enable-ssl - 🔒 Enable HTTPS config"
        echo "  renew-ssl  - 🔒 Renew SSL certificate"
        echo "  artisan    - ⚙️  Run artisan command"
        echo "  shell      - 🐚 Open shell in app container"
        echo ""
        echo "Examples:"
        echo "  ./deploy.sh clean           # Remove everything"
        echo "  ./deploy.sh init            # Fresh deployment"
        echo "  ./deploy.sh logs nginx      # View nginx logs"
        echo "  ./deploy.sh artisan migrate # Run migration"
        ;;
esac
