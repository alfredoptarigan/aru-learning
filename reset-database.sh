#!/bin/bash

echo "🗑️  Database Reset Options"
echo "================================"
echo ""

# Check if containers are running
if ! docker compose ps | grep -q "aru-learning"; then
    echo "❌ Containers are not running!"
    echo "Run: docker compose up -d"
    exit 1
fi

echo "Choose method:"
echo "1) Drop & recreate database (via postgres container)"
echo "2) Fresh migrate (via app container)"
echo "3) Open postgres shell manually"
echo "4) Open app shell manually"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
  1)
    echo "🗑️  Dropping and recreating database..."
    docker compose exec aru-learning-postgres psql -U ${DB_USERNAME:-laravel} -c "DROP DATABASE IF EXISTS ${DB_DATABASE:-aru_learning};"
    docker compose exec aru-learning-postgres psql -U ${DB_USERNAME:-laravel} -c "CREATE DATABASE ${DB_DATABASE:-aru_learning};"
    echo "✅ Database recreated!"
    echo ""
    echo "Now run migrations:"
    echo "docker compose exec aru-learning-app php artisan migrate --force --seed"
    ;;
  2)
    echo "🔄 Running fresh migration..."
    docker compose exec aru-learning-app php artisan migrate:fresh --force --seed
    echo "✅ Done!"
    ;;
  3)
    echo "📊 Opening PostgreSQL shell..."
    echo "Commands you can use:"
    echo "  - \l                 (list databases)"
    echo "  - \c aru_learning    (connect to database)"
    echo "  - DROP DATABASE aru_learning; CREATE DATABASE aru_learning;"
    echo "  - \q                 (quit)"
    echo ""
    docker compose exec aru-learning-postgres psql -U ${DB_USERNAME:-laravel}
    ;;
  4)
    echo "🐚 Opening app shell..."
    echo "Commands you can use:"
    echo "  - php artisan migrate:fresh --force --seed"
    echo "  - php artisan db:wipe --force"
    echo "  - php artisan migrate --force"
    echo ""
    docker compose exec aru-learning-app sh
    ;;
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac
