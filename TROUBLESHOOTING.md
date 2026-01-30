# 🔧 ARU Learning - Troubleshooting Guide

Panduan lengkap untuk mengatasi masalah umum pada deployment ARU Learning.

---

## 📋 Daftar Isi

1. [Container Issues](#container-issues)
2. [Environment & Configuration](#environment--configuration)
3. [Database Issues](#database-issues)
4. [SSL/HTTPS Issues](#sslhttps-issues)
5. [Permission Issues](#permission-issues)
6. [Application Errors](#application-errors)
7. [Performance Issues](#performance-issues)

---

## Container Issues

### ❌ Container tidak mau start

**Symptoms:**
```
Error: Cannot start container...
```

**Diagnosis:**
```bash
# Check Docker daemon
sudo systemctl status docker

# Check logs
docker compose logs

# Check disk space
df -h
```

**Solutions:**
```bash
# 1. Restart Docker daemon
sudo systemctl restart docker

# 2. Clean up old containers/images
docker system prune -a

# 3. Rebuild from scratch
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

---

### ❌ Container restart loop

**Symptoms:**
```
Container keeps restarting every few seconds
```

**Diagnosis:**
```bash
# Check container status
docker compose ps

# View logs
docker compose logs app --tail=100

# Check resource usage
docker stats
```

**Solutions:**
```bash
# 1. Check application logs for errors
docker compose logs app | grep -i error

# 2. Verify .env configuration
docker compose exec app cat .env | head -20

# 3. Check if database is ready
docker compose exec app php artisan db:monitor

# 4. Restart in correct order
docker compose down
docker compose up -d postgres redis
sleep 10
docker compose up -d app
```

---

## Environment & Configuration

### ❌ Error: "Failed to open stream: No such file or directory" (.env)

**Symptoms:**
```
file_get_contents(/var/www/html/.env): Failed to open stream: No such file or directory
```

**Root Cause:**
- File `.env` tidak ada di server
- File `.env` tidak ter-copy ke dalam Docker container
- APP_KEY kosong saat startup

**Solutions:**

**Step 1: Pastikan .env ada di server**
```bash
# SSH ke server
ssh root@YOUR_SERVER_IP

# Check file .env
cd /var/www/aru-learning
ls -la .env

# Jika tidak ada, copy dari example
cp .env.example .env

# Edit dengan nilai yang benar
nano .env
```

**Step 2: Rebuild Docker containers**
```bash
# Stop containers
docker compose down

# Rebuild images
docker compose build --no-cache

# Start again
docker compose up -d

# Check logs
docker compose logs app
```

**Step 3: Verify APP_KEY generated**
```bash
# Startup script akan auto-generate APP_KEY
docker compose logs app | grep "Application key"

# Atau manual generate
docker compose exec app php artisan key:generate --force
```

**Prevention:**
- Selalu buat file `.env` SEBELUM `docker compose build`
- Pastikan `.env` berisi semua konfigurasi yang diperlukan
- Startup script sekarang auto-generate APP_KEY jika kosong

---

### ❌ APP_KEY not set error

**Symptoms:**
```
RuntimeException: No application encryption key has been specified.
```

**Solutions:**
```bash
# Generate key manually
docker compose exec app php artisan key:generate --force

# Verify it's set
docker compose exec app php artisan tinker
>>> env('APP_KEY');
# Should show: "base64:xxxxxx..."
>>> exit

# Restart container to apply
docker compose restart app
```

---

### ⚠️ Warning: "attribute `version` is obsolete"

**Symptoms:**
```
WARN[0000] /var/www/aru-learning/docker-compose.yml: the attribute `version` is obsolete
```

**Fix:**
Hapus baris `version:` di `docker-compose.yml`. Ini hanya warning dan tidak mempengaruhi functionality.

```bash
# Edit docker-compose.yml
nano docker-compose.yml

# Hapus atau comment baris ini:
# version: '3.8'
```

---

## Database Issues

### ❌ Can't connect to database

**Symptoms:**
```
SQLSTATE[08006] Connection refused
```

**Diagnosis:**
```bash
# Check PostgreSQL status
docker compose ps postgres

# View PostgreSQL logs
docker compose logs postgres

# Test connection
docker compose exec app php artisan db:monitor
```

**Solutions:**
```bash
# 1. Restart PostgreSQL
docker compose restart postgres

# 2. Wait for PostgreSQL to be ready
sleep 10
docker compose exec app php artisan db:monitor

# 3. Check credentials in .env
docker compose exec app cat .env | grep DB_

# 4. Connect manually to verify
docker compose exec postgres psql -U laravel -d aru_learning
# Type: \q to quit
```

---

### ❌ Database authentication failed

**Symptoms:**
```
SQLSTATE[08006] password authentication failed
```

**Solutions:**
```bash
# 1. Check DB_PASSWORD matches in .env and docker-compose.yml
cat .env | grep DB_PASSWORD
cat docker-compose.yml | grep POSTGRES_PASSWORD

# 2. Reset database (DESTRUCTIVE!)
docker compose down -v
docker compose up -d postgres
sleep 10
docker compose up -d app

# 3. Run migrations again
docker compose exec app php artisan migrate:fresh --force
```

---

## SSL/HTTPS Issues

### ❌ SSL certificate not working

**Symptoms:**
- Browser shows "Not Secure"
- Certificate error in browser

**Diagnosis:**
```bash
# Check Traefik logs
docker compose logs traefik | grep -i certificate

# Verify DNS
dig aru-learning.alfredoptarigan.tech

# Check ports
sudo netstat -tlnp | grep -E ':(80|443)'
```

**Solutions:**
```bash
# 1. Verify DNS points to server
dig aru-learning.alfredoptarigan.tech
# Should show your server IP

# 2. Check firewall
sudo ufw status
# Ports 80 and 443 should be open

# 3. Wait for cert generation (can take 1-2 minutes)
docker compose logs -f traefik

# 4. Restart Traefik
docker compose restart traefik

# 5. Force cert renewal
docker compose down
rm -rf traefik/acme.json  # Delete old certs
docker compose up -d
```

---

### ❌ HTTP redirects to HTTPS but shows error

**Solutions:**
```bash
# Check if domain is correct in .env
grep APP_URL .env
# Should be: APP_URL=https://your-domain.com

# Update and rebuild
nano .env  # Fix APP_URL
docker compose restart app
```

---

## Permission Issues

### ❌ Permission denied: storage/logs

**Symptoms:**
```
file_put_contents(/var/www/html/storage/logs/laravel.log): failed to open stream: Permission denied
```

**Solutions:**
```bash
# Fix storage permissions
docker compose exec -u root app chown -R www-data:www-data storage bootstrap/cache
docker compose exec -u root app chmod -R 775 storage bootstrap/cache

# Verify permissions
docker compose exec app ls -la storage/
```

---

## Application Errors

### ❌ 502 Bad Gateway

**Symptoms:**
- Nginx/Traefik shows 502 error
- Application not responding

**Diagnosis:**
```bash
# Check app container
docker compose ps app
docker compose logs app --tail=50

# Check PHP-FPM
docker compose exec app php-fpm -t
```

**Solutions:**
```bash
# 1. Restart app container
docker compose restart app

# 2. Check if PHP-FPM is running
docker compose exec app ps aux | grep php-fpm

# 3. Rebuild if necessary
docker compose down
docker compose build app
docker compose up -d
```

---

### ❌ Class not found errors

**Symptoms:**
```
Class 'App\Something' not found
```

**Solutions:**
```bash
# 1. Rebuild autoload
docker compose exec app composer dump-autoload

# 2. Clear config cache
docker compose exec app php artisan config:clear
docker compose exec app php artisan cache:clear

# 3. Rebuild config
docker compose exec app php artisan config:cache
```

---

### ❌ View not found / Blade errors

**Solutions:**
```bash
# Clear view cache
docker compose exec app php artisan view:clear

# Rebuild view cache
docker compose exec app php artisan view:cache
```

---

## Performance Issues

### ❌ Application very slow

**Diagnosis:**
```bash
# Check resource usage
docker stats

# Check logs for slow queries
docker compose logs app | grep -i slow
```

**Solutions:**
```bash
# 1. Enable all caching
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
docker compose exec app php artisan view:cache
docker compose exec app php artisan event:cache

# 2. Check Redis is working
docker compose exec app php artisan tinker
>>> Redis::ping();
# Should return: "PONG"
>>> exit

# 3. Optimize database
docker compose exec postgres vacuumdb -U laravel -d aru_learning -z

# 4. Check server resources
free -m
df -h
```

---

## Debug Mode Commands

### Enable Detailed Logging

**Temporary debug mode:**
```bash
# Enable debug mode
docker compose exec app php artisan down
nano .env
# Set: APP_DEBUG=true
# Set: LOG_LEVEL=debug

docker compose restart app
docker compose exec app php artisan up

# View detailed logs
docker compose logs -f app
```

**⚠️ IMPORTANT:** Jangan lupa disable debug mode setelah selesai!

---

## Useful Diagnostic Commands

```bash
# Check all services
docker compose ps

# View all logs
docker compose logs

# Follow specific service logs
docker compose logs -f app

# Check Laravel version
docker compose exec app php artisan --version

# Check database connection
docker compose exec app php artisan db:monitor

# Test Redis
docker compose exec app php artisan tinker
>>> Redis::ping();

# Check routes
docker compose exec app php artisan route:list

# Check config
docker compose exec app php artisan config:show

# Access shell
docker compose exec app sh

# Access database
docker compose exec postgres psql -U laravel -d aru_learning

# Check resource usage
docker stats
```

---

## Complete Reset (Last Resort)

**⚠️ WARNING: This will DELETE ALL DATA!**

```bash
# 1. Stop and remove everything
docker compose down -v

# 2. Remove all images
docker compose rm -f

# 3. Clean up system
docker system prune -a -f

# 4. Start fresh
docker compose build --no-cache
docker compose up -d

# 5. Wait for database
sleep 15

# 6. Run migrations
docker compose exec app php artisan migrate:fresh --force

# 7. Seed database
docker compose exec app php artisan db:seed --force
```

---

## Getting Help

Jika masalah masih belum terselesaikan:

1. **Collect diagnostic info:**
   ```bash
   docker compose ps > diagnostic.txt
   docker compose logs >> diagnostic.txt
   cat .env | grep -v PASSWORD >> diagnostic.txt
   ```

2. **Check logs:**
   - Application logs: `docker compose logs app`
   - Database logs: `docker compose logs postgres`
   - Traefik logs: `docker compose logs traefik`

3. **Contact support:**
   - Email: alfredoptarigan@tech.com
   - Include diagnostic.txt file

---

**Made with ❤️ by Pixel Edu Team**
