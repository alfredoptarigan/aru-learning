#!/bin/sh
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 ARU LEARNING - Starting Application"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Sync public folder to shared volume (for Nginx)
echo "📁 Syncing public assets..."
if [ -d "/var/www/html/public" ] && [ -d "/var/www/html/public-shared" ]; then
    cp -r /var/www/html/public/* /var/www/html/public-shared/ 2>/dev/null || true
    echo "✅ Public assets synced!"
else
    echo "⚠️  Public folder sync skipped"
fi

# Generate application key if not set
if ! grep -q "APP_KEY=base64:" /var/www/html/.env 2>/dev/null; then
    echo "🔑 Generating application key..."
    php artisan key:generate --force --no-interaction
fi

# Wait for database
echo "⏳ Waiting for database..."
timeout=60
elapsed=0
until php artisan db:show 2>/dev/null; do
    if [ $elapsed -ge $timeout ]; then
        echo "❌ Database connection timeout!"
        exit 1
    fi
    echo "   Waiting... (${elapsed}s/${timeout}s)"
    sleep 2
    elapsed=$((elapsed + 2))
done
echo "✅ Database connected!"

# Run migrations
echo "📊 Running migrations..."
php artisan migrate --force --no-interaction

# Run seeders if APP_SEED=true
if [ "$APP_SEED" = "true" ]; then
    echo "🌱 Running seeders..."
    php artisan db:seed --force --no-interaction
fi

# Storage link
echo "🔗 Creating storage link..."
php artisan storage:link 2>/dev/null || true

# Cache for production
if [ "$APP_ENV" = "production" ]; then
    echo "⚡ Caching configuration..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Fix permissions
echo "🔐 Setting permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Application started!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exec php-fpm
