# 🔧 Fix 404 Error (Updated Solution)

## Masalah
- ✅ HTTPS sudah jalan  
- ❌ Tapi dapat **404 Page Not Found**
- ❌ `ls -la` tidak berfungsi, `index.php` tidak ada

## Root Cause

**`volumes_from` tidak bekerja dengan file yang di-COPY dalam Dockerfile!**

`volumes_from` hanya share **declared volumes**, bukan filesystem. Karena `public/` folder di-COPY (bukan volume), Nginx tidak bisa aksesnya.

## Solusi Baru: Shared Volume + Startup Copy

### Arsitektur:

```
1. App container build → public/ dengan Vite assets
2. Startup script → copy public/ ke shared volume
3. Nginx mount shared volume → bisa akses semua files
```

### Perubahan:

**docker-compose.yml:**
```yaml
volumes:
  app_public:  # NEW: shared volume

services:
  app:
    volumes:
      - app_public:/var/www/html/public-shared  # Mount shared volume
  
  nginx:
    volumes:
      - app_public:/var/www/html/public:ro  # Mount sama, read-only
```

**startup.sh:**
```bash
# Copy public folder to shared volume on first boot
if [ ! -f /var/www/html/public-shared/index.php ]; then
    cp -r /var/www/html/public/* /var/www/html/public-shared/
fi
```

## Deploy di Server

```bash
# Pull changes
git pull origin main

# Run fix script
./fix-404.sh

# Atau manual:
docker compose down
docker volume rm aru-learning_app_public  # Remove old volume
docker compose build --no-cache app
docker compose up -d
```

## Verify

```bash
# Wait for startup (30s)
sleep 30

# Check Nginx can see public folder
docker compose exec aru-learning-nginx ls -la /var/www/html/public/

# Should show:
# drwxr-xr-x ... .
# drwxr-xr-x ... ..
# -rw-r--r-- ... index.php
# drwxr-xr-x ... build
# -rw-r--r-- ... favicon.ico
# etc...

# Check index.php exists
docker compose exec aru-learning-nginx cat /var/www/html/public/index.php | head -5

# Check Vite assets
docker compose exec aru-learning-nginx ls /var/www/html/public/build/

# Test website
curl -I https://aru-learning.alfredoptarigan.tech
# Expected: HTTP/2 200 ✅
```

## Troubleshooting

### index.php tidak ada di Nginx

```bash
# Check if app container has public folder
docker compose exec aru-learning-app ls -la /var/www/html/public/

# Check if copy happened
docker compose logs app | grep "Syncing public folder"

# Manual copy
docker compose exec aru-learning-app sh -c "cp -r /var/www/html/public/* /var/www/html/public-shared/"

# Restart Nginx
docker compose restart nginx
```

### Still 404

```bash
# Check Nginx error logs
docker compose logs nginx | tail -50

# Check if Nginx can reach PHP-FPM
docker compose exec aru-learning-nginx ping aru-learning-app

# Check Nginx config syntax
docker compose exec aru-learning-nginx nginx -t

# Full restart
docker compose restart
```

### Build folder kosong

```bash
# Check if Vite built properly
docker compose exec aru-learning-app ls -la /var/www/html/public/build/

# If empty, rebuild
docker compose build --no-cache app
docker compose up -d
```

## Files Changed

1. **docker-compose.yml**
   - Added `app_public` volume
   - App mounts to `/var/www/html/public-shared`
   - Nginx mounts to `/var/www/html/public`

2. **docker/scripts/startup.sh**
   - Added copy logic to sync public folder

3. **fix-404.sh**
   - Updated deployment script

## Why This Works

**Named Volume Approach:**
- ✅ Named volume persists between container restarts
- ✅ Can be mounted by multiple containers
- ✅ Startup script copies from image to volume (one-time)
- ✅ Nginx reads from volume (fast, cached)

**Flow:**
1. Docker build → Vite assets in image at `/var/www/html/public`
2. Container start → Mount volume to `/var/www/html/public-shared`
3. Startup script → Copy `/var/www/html/public/*` → `/var/www/html/public-shared/`
4. Nginx → Read from volume at `/var/www/html/public`
5. Both containers → Share same files via volume ✅

## Alternative Solutions (Not Used)

1. ❌ **volumes_from** - Doesn't work with COPY
2. ❌ **Mount ./public from host** - Vite assets not on host
3. ❌ **Build on host** - Defeats Docker's purpose
4. ❌ **Single container** - Separates concerns is better

**Named volume + startup copy = ✅ Best solution**
