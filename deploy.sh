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
        echo "Please create certificates at /etc/ssl/cloudflare/"
        echo "  - /etc/ssl/cloudflare/cert.pem"
        echo "  - /etc/ssl/cloudflare/key.pem"
        echo ""
        echo "Get them from: Cloudflare Dashboard → SSL/TLS → Origin Server → Create Certificate"
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
        echo "🗑️  Removing old containers..."
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
    # INIT - Fresh deployment
    # =========================================
    init)
        check_env
        check_ssl
        
        echo "📋 Starting deployment..."
        echo ""
        
        # Step 1: Build app
        echo "1️⃣ Building application..."
        docker compose build app
        
        # Step 2: Start database and redis
        echo ""
        echo "2️⃣ Starting database and redis..."
        docker compose up -d postgres redis
        
        echo ""
        echo "⏳ Waiting for database (20s)..."
        sleep 20
        
        # Step 3: Start app
        echo ""
        echo "3️⃣ Starting application..."
        docker compose up -d app
        
        echo ""
        echo "⏳ Waiting for app (30s)..."
        sleep 30
        
        # Check app
        if ! docker compose ps app | grep -q "Up"; then
            echo "❌ App failed to start!"
            docker compose logs --tail=50 app
            exit 1
        fi
        echo "✅ App is running!"
        
        # Step 4: Start nginx
        echo ""
        echo "4️⃣ Starting nginx..."
        docker compose up -d nginx
        
        sleep 5
        
        # Check nginx
        if ! docker compose ps nginx | grep -q "Up"; then
            echo "❌ Nginx failed to start!"
            docker compose logs --tail=30 nginx
            exit 1
        fi
        echo "✅ Nginx is running!"
        
        # Step 5: Verify
        echo ""
        echo "5️⃣ Verifying deployment..."
        docker compose ps
        
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ Deployment complete!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "🌐 https://$DOMAIN"
        echo ""
        echo "📝 Make sure Cloudflare SSL mode is set to 'Full' or 'Full (Strict)'"
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
        docker compose up -d nginx
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
        echo "  clean    - 🧹 Remove ALL containers, volumes, networks"
        echo "  init     - 🚀 Initial deployment"
        echo "  start    - ▶️  Start all services"
        echo "  stop     - ⏹️  Stop all services"
        echo "  restart  - 🔄 Restart all services"
        echo "  update   - 📥 Pull changes and rebuild"
        echo "  status   - 📊 Show container status"
        echo "  logs     - 📋 View logs (optional: service name)"
        echo "  artisan  - ⚙️  Run artisan command"
        echo "  shell    - 🐚 Open shell in app container"
        echo ""
        echo "Examples:"
        echo "  ./deploy.sh clean"
        echo "  ./deploy.sh init"
        echo "  ./deploy.sh logs nginx"
        echo "  ./deploy.sh artisan migrate"
        ;;
esac
