#!/bin/sh
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 ARU LEARNING - Starting Application"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
timeout=60
elapsed=0
until php artisan db:monitor --max-attempts=1 2>/dev/null; do
    if [ $elapsed -ge $timeout ]; then
        echo "❌ Database connection timeout!"
        exit 1
    fi
    echo "   Still waiting for database... (${elapsed}s/${timeout}s)"
    sleep 2
    elapsed=$((elapsed + 2))
done
echo "✅ Database connected!"

# Run migrations
echo ""
echo "📊 Running database migrations..."
php artisan migrate --force --no-interaction

# Run seeders (only if APP_SEED=true)
if [ "$APP_SEED" = "true" ]; then
    echo ""
    echo "🌱 Running database seeders..."
    php artisan db:seed --force --no-interaction
else
    echo ""
    echo "⏭️  Skipping database seeders (APP_SEED=$APP_SEED)"
fi

# Create storage link
echo ""
echo "🔗 Creating storage symlink..."
php artisan storage:link

# Cache optimization for production
if [ "$APP_ENV" = "production" ]; then
    echo ""
    echo "⚡ Optimizing for production..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    php artisan event:cache
else
    echo ""
    echo "🔧 Development mode - clearing caches..."
    php artisan config:clear
    php artisan route:clear
    php artisan view:clear
fi

# Set proper permissions
echo ""
echo "🔐 Setting file permissions..."
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Application started successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start PHP-FPM
exec php-fpm
