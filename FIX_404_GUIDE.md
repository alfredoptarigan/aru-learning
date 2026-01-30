# 🔧 Fix 404 Error - Quick Guide

## Masalah
✗ HTTPS sudah jalan
✗ Tapi dapat **404 Page Not Found**

## Penyebab
Nginx tidak bisa akses `public/index.php` dan Vite assets yang ada **di dalam app container**.

### Sebelumnya:
```
Nginx mount: ./public (dari host server)
App container: /var/www/html/public (Vite build assets ada di sini)
```

❌ **Nginx tidak bisa lihat Vite assets!**

### Sesudahnya:
```yaml
nginx:
  volumes_from:
    - app:ro  # Share filesystem dari app container
```

✅ **Nginx bisa akses semua file di app container**

## Deploy Fix di Server

```bash
# Pull latest changes
git pull origin main

# Run fix script
./fix-404.sh

# Atau manual:
docker compose down
docker compose build --no-cache app
docker compose up -d
```

## Verify Fix

```bash
# Check Nginx bisa akses public folder
docker compose exec aru-learning-nginx ls -la /var/www/html/public/

# Should show:
# - index.php
# - build/ (Vite assets)
# - favicon.ico, robots.txt, dll

# Test access
curl -I https://aru-learning.alfredoptarigan.tech
# Should return: HTTP/2 200 (not 404!)
```

## Troubleshooting

### Still 404?

```bash
# Check Nginx logs
docker compose logs nginx

# Check if index.php exists
docker compose exec aru-learning-nginx cat /var/www/html/public/index.php

# Check Nginx can reach PHP-FPM
docker compose exec aru-learning-nginx ping aru-learning-app

# Restart everything
docker compose restart
```

### Blank page / Laravel error?

```bash
# Check app logs
docker compose logs app

# Check Laravel logs
docker compose exec aru-learning-app tail -100 /var/www/html/storage/logs/laravel.log

# Clear cache
docker compose exec aru-learning-app php artisan config:clear
docker compose exec aru-learning-app php artisan cache:clear
docker compose exec aru-learning-app php artisan view:clear
```

## Files Changed

- `docker-compose.yml` - Added `volumes_from: app:ro` to nginx service

## Technical Details

**volumes_from** adalah fitur Docker Compose yang memungkinkan satu container **share filesystem** dengan container lain. Ini perfect untuk kasus:

- ✅ Nginx butuh akses ke static files (public/)
- ✅ PHP-FPM container sudah punya semua files (dari Docker build)
- ✅ Tidak perlu rebuild Vite assets di server
- ✅ Single source of truth untuk application files

**Alternative solusi** (tidak digunakan):
1. Mount `./public` dari host → ❌ Vite assets tidak ada di host
2. Shared named volume → ❌ Kompleks, perlu init container
3. Mount `./` (entire codebase) → ❌ Expose .env, vendor, dll

**volumes_from = best solution** ✅
