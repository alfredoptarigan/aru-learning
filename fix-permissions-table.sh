#!/bin/bash

echo "🔧 Fixing Permission Groups Table..."

# Option 1: Fresh migrate (WARNING: This will delete all data)
echo "Choose fix method:"
echo "1) Fresh migrate (deletes all data)"
echo "2) Drop permission_groups table only and re-migrate"
echo "3) Just re-run seeders"

read -p "Enter choice (1-3): " choice

case $choice in
  1)
    docker-compose exec app php artisan migrate:fresh --force --seed
    ;;
  2)
    docker-compose exec app php artisan db:wipe permission_groups --force
    docker-compose exec app php artisan migrate --force
    docker-compose exec app php artisan db:seed --class=PermissionsSeeder --force
    ;;
  3)
    docker-compose exec app php artisan db:seed --class=PermissionsSeeder --force
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

echo "✅ Done!"
