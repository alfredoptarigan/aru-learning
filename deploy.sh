#!/bin/bash
set -e

DOMAIN="aru-learning.alfredoptarigan.tech"

echo "🚀 ARU Learning - Deployment Script"
echo "===================================="
echo ""

check_env() {
    if [ ! -f ".env" ]; then
        echo "❌ .env file not found!"
        echo "   Run: cp .env.example .env && nano .env"
        exit 1
    fi
}

check_ssl() {
    if [ ! -f "/etc/ssl/cloudflare/cert.pem" ] || [ ! -f "/etc/ssl/cloudflare/key.pem" ]; then
        echo "❌ Cloudflare SSL certificates not found!"
        echo ""
        echo "Create at /etc/ssl/cloudflare/:"
        echo "  - cert.pem"
        echo "  - key.pem"
        exit 1
    fi
}

case "$1" in
    clean)
        echo "🧹 Cleaning ALL Docker resources..."
        read -p "Delete database too? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            echo "Cancelled."
            exit 0
        fi
        
        docker compose down --remove-orphans 2>/dev/null || true
        docker rm -f aru-learning-nginx aru-learning-app aru-learning-postgres aru-learning-redis aru-learning-certbot aru-learning-traefik 2>/dev/null || true
        docker volume rm aru-learning_postgres_data aru-learning_redis_data aru-learning_public_assets aru-learning_certbot_certs aru-learning_certbot_www aru-learning_traefik_certs aru-learning_app_public 2>/dev/null || true
        docker network rm aru-learning_app_network aru-learning_default 2>/dev/null || true
        docker system prune -f
        
        echo "✅ Clean complete!"
        echo "Next: ./deploy.sh init"
        ;;

    init)
        check_env
        check_ssl
        
        echo "📋 Starting deployment..."
        
        # Remove old public volume to force fresh sync
        echo "🗑️  Removing old public assets volume..."
        docker volume rm aru-learning_public_assets 2>/dev/null || true
        
        echo "1️⃣ Building application..."
        docker compose build app
        
        echo "2️⃣ Starting database and redis..."
        docker compose up -d postgres redis
        sleep 20
        
        echo "3️⃣ Starting application..."
        docker compose up -d app
        sleep 30
        
        if ! docker compose ps app | grep -q "Up"; then
            echo "❌ App failed!"
            docker compose logs --tail=50 app
            exit 1
        fi
        echo "✅ App running!"
        
        echo "4️⃣ Starting nginx..."
        docker compose up -d nginx
        sleep 5
        
        if ! docker compose ps nginx | grep -q "Up"; then
            echo "❌ Nginx failed!"
            docker compose logs --tail=30 nginx
            exit 1
        fi
        echo "✅ Nginx running!"
        
        echo "5️⃣ Verifying assets..."
        docker compose exec nginx ls /var/www/html/public/build/ 2>/dev/null && echo "✅ Vite assets found!" || echo "⚠️  Vite assets may not be synced yet"
        
        echo ""
        docker compose ps
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ Deployment complete!"
        echo "🌐 https://$DOMAIN"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        ;;

    update)
        check_env
        echo "🔄 Updating..."
        git pull origin main
        docker volume rm aru-learning_public_assets 2>/dev/null || true
        docker compose build app
        docker compose up -d
        echo "✅ Updated!"
        ;;

    start)
        check_env
        docker compose up -d postgres redis && sleep 10
        docker compose up -d app && sleep 10
        docker compose up -d nginx
        docker compose ps
        ;;

    stop)
        docker compose down
        ;;

    restart)
        docker compose restart
        docker compose ps
        ;;

    logs)
        docker compose logs -f ${2:-}
        ;;

    status)
        docker compose ps
        echo ""
        docker ps -a --filter "name=aru-learning" --format "table {{.Names}}\t{{.Status}}"
        ;;

    artisan)
        shift
        docker compose exec app php artisan "$@"
        ;;

    shell)
        docker compose exec app sh
        ;;

    *)
        echo "Usage: ./deploy.sh [command]"
        echo ""
        echo "  clean    - Remove all containers & volumes"
        echo "  init     - Fresh deployment"
        echo "  update   - Pull & rebuild"
        echo "  start    - Start services"
        echo "  stop     - Stop services"
        echo "  restart  - Restart services"
        echo "  status   - Show status"
        echo "  logs     - View logs"
        echo "  artisan  - Run artisan"
        echo "  shell    - App shell"
        ;;
esac
