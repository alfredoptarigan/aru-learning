# 🔄 Rombak Total - Simple Architecture

## Perubahan Besar

### ❌ REMOVED: Traefik
- Terlalu kompleks untuk debugging
- Layer tambahan yang tidak perlu

### ✅ NEW: Nginx Only + Certbot
- Nginx langsung handle HTTP/HTTPS
- Certbot untuk Let's Encrypt
- Lebih mudah di-debug
- Standard setup

## New Architecture

```
Internet (80/443)
    ↓
Nginx (SSL termination + web server)
    ↓
PHP-FPM (Laravel)
    ↓
PostgreSQL + Redis
```

## Files Created

1. **docker-compose.simple.yml** - Simple docker-compose tanpa Traefik
2. **docker/nginx/nginx.conf** - Main Nginx config
3. **docker/nginx/conf.d/app.conf** - HTTPS Laravel config
4. **docker/nginx/conf.d/app-http-only.conf** - HTTP-only untuk initial setup
5. **deploy-simple.sh** - Automated deployment script

## Deployment Steps

### Quick Deploy (Automated)

```bash
# Pull changes
git pull origin main

# Run deployment script
./deploy-simple.sh
```

Script akan:
1. ✅ Check DNS
2. ✅ Start dengan HTTP-only
3. ✅ Request SSL certificate via Certbot
4. ✅ Switch ke HTTPS config
5. ✅ Setup auto-renewal

### Manual Steps

#### Step 1: Start HTTP-only

```bash
# Use simple docker-compose
cp docker-compose.simple.yml docker-compose.yml

# Start services
docker compose down
docker compose build app
docker compose up -d nginx app postgres redis

# Test HTTP
curl -I http://aru-learning.alfredoptarigan.tech
```

#### Step 2: Get SSL Certificate

```bash
# Run certbot
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email alfredoptarigan@tech.com \
    --agree-tos \
    --no-eff-email \
    -d aru-learning.alfredoptarigan.tech
```

#### Step 3: Enable HTTPS

```bash
# Remove HTTP-only config
rm docker/nginx/conf.d/app-http-only.conf

# Restart with SSL config
docker compose up -d certbot
docker compose restart nginx

# Test HTTPS
curl -I https://aru-learning.alfredoptarigan.tech
```

## Troubleshooting

### HTTP works but 404?

```bash
# Check Nginx can see public folder
docker compose exec nginx ls -la /var/www/html/public/

# Check Nginx can reach PHP-FPM
docker compose exec nginx ping aru-learning-app

# Check Nginx error logs
docker compose logs nginx | tail -50
```

### SSL certificate fails?

```bash
# Check DNS
nslookup aru-learning.alfredoptarigan.tech

# Check port 80 accessible
curl -I http://aru-learning.alfredoptarigan.tech

# Check certbot logs
docker compose logs certbot

# Manual test
docker compose run --rm certbot certonly \
    --webroot --webroot-path=/var/www/certbot \
    --email alfredoptarigan@tech.com \
    --agree-tos --dry-run \
    -d aru-learning.alfredoptarigan.tech
```

### Still 404 after everything?

```bash
# Check public folder mount
docker compose exec app ls -la /var/www/html/public/

# Should have: index.php, build/, favicon.ico

# Check Nginx config syntax
docker compose exec nginx nginx -t

# Check PHP-FPM logs
docker compose logs app | tail -50
```

## Why This is Better

### Before (Traefik):
```
Internet → Traefik → Nginx → PHP-FPM → App
           ↓ (labels, routing, middleware)
```
- Complex routing rules
- Hard to debug 404s
- Extra layer

### After (Nginx Only):
```
Internet → Nginx → PHP-FPM → App
           ↓ (SSL, routing, static files)
```
- Direct routing
- Easy to debug
- Standard setup
- One less moving part

## Verification

After deployment, check:

```bash
# Container status
docker compose ps

# Should show:
# nginx    Up   0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
# app      Up
# certbot  Up
# postgres Up
# redis    Up

# Test site
curl -I https://aru-learning.alfredoptarigan.tech
# Expected: HTTP/2 200

# Check SSL
openssl s_client -connect aru-learning.alfredoptarigan.tech:443 -servername aru-learning.alfredoptarigan.tech < /dev/null | grep -E "subject|issuer"
```

## Backup

Original Traefik setup backed up to:
- `docker-compose.yml.traefik-backup`

To rollback:
```bash
cp docker-compose.yml.traefik-backup docker-compose.yml
docker compose up -d
```

## Next Steps

1. Deploy to server with `./deploy-simple.sh`
2. Verify HTTP works
3. Get SSL certificate
4. Verify HTTPS works
5. Done! 🎉

**No more Traefik complexity!**
