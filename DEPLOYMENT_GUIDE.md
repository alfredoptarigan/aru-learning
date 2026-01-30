# 🚀 ARU Learning - Step-by-Step Production Deployment

**Complete guide to deploy ARU Learning to production server using Docker**

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] A server with Ubuntu 22.04 LTS (or similar)
- [ ] Root or sudo access to the server
- [ ] Domain DNS configured (A record pointing to server IP)
- [ ] Server IP address
- [ ] SSH access configured

**Server Requirements:**
- RAM: Minimum 2GB (4GB recommended)
- Storage: Minimum 20GB free space
- Ports 80 and 443 available

---

## 🎯 PHASE 1: Server Preparation

### Step 1.1: Connect to Your Server

```bash
# From your local computer, connect via SSH
ssh root@YOUR_SERVER_IP

# Example:
# ssh root@157.245.xxx.xxx
```

---

### Step 1.2: Update System Packages

```bash
# Update package list
sudo apt update

# Upgrade all packages
sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl git wget nano
```

**Expected output:**
```g
Reading package lists... Done
Building dependency tree... Done
...
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
```

---

### Step 1.3: Install Docker

```bash
# Download Docker installation script
curl -fsSL https://get.docker.com -o get-docker.sh

# Run installation script
sudo sh get-docker.sh

# Verify Docker installation
docker --version

# Should show: Docker version 24.x.x or higher
```

**Expected output:**
```
Docker version 24.0.7, build afdd53b
```

---

### Step 1.4: Install Docker Compose

Docker Compose v2 should be included with Docker. Verify:

```bash
# Check Docker Compose
docker compose version

# Should show: Docker Compose version v2.x.x or higher
```

**If not installed:**
```bash
# Install Docker Compose plugin
sudo apt install docker-compose-plugin
```

---

### Step 1.5: Configure User Permissions

```bash
# Add current user to docker group
sudo usermod -aG docker $USER

# Apply group changes (or logout and login again)
newgrp docker

# Test Docker without sudo
docker ps

# Should show: CONTAINER ID   IMAGE   ... (empty list is OK)
```

---

### Step 1.6: Configure Firewall

```bash
# Allow SSH (important! don't lock yourself out)
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status

# Should show:
# To                         Action      From
# --                         ------      ----
# 22/tcp                     ALLOW       Anywhere
# 80/tcp                     ALLOW       Anywhere
# 443/tcp                    ALLOW       Anywhere
```

---

## 🎯 PHASE 2: Application Setup

### Step 2.1: Create Application Directory

```bash
# Navigate to web directory
cd /var/www

# Clone your repository (replace with your actual repo URL)
git clone https://github.com/YOUR_USERNAME/aru-learning.git aru-learning

# If private repository, you'll need to authenticate
# Use SSH key or personal access token

# Enter application directory
cd aru-learning

# Verify you're in the right place
pwd
# Should show: /var/www/aru-learning

# List files
ls -la
# Should show: Dockerfile, docker-compose.yml, .env.example, etc.
```

---

### Step 2.2: Create Production Environment File

```bash
# Copy the environment template
cp .env.example .env

# Edit the environment file
nano .env
```

**Now fill in the values. Here's your complete production `.env` file:**

```env
# =====================================================
# Application Configuration
# =====================================================
APP_NAME="Pixel Edu"
APP_ENV=production
APP_KEY=                    # ← LEAVE EMPTY, will be generated
APP_DEBUG=false
APP_TIMEZONE=Asia/Jakarta
APP_URL=https://aru-learning.alfredoptarigan.tech

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US
APP_MAINTENANCE_DRIVER=file
BCRYPT_ROUNDS=12

# =====================================================
# Logging
# =====================================================
LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

# =====================================================
# Database (PostgreSQL)
# =====================================================
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=aru_learning
DB_USERNAME=laravel
DB_PASSWORD=                # ← FILL THIS: Generate strong password

# =====================================================
# Session & Cache (Redis)
# =====================================================
SESSION_DRIVER=redis
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

CACHE_STORE=redis
CACHE_PREFIX=aru_learning_cache

# =====================================================
# Broadcasting & Queue
# =====================================================
BROADCAST_CONNECTION=log
QUEUE_CONNECTION=redis

# =====================================================
# Redis Configuration
# =====================================================
REDIS_CLIENT=phpredis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=             # ← FILL THIS: Optional but recommended

# =====================================================
# Filesystem & Storage
# =====================================================
FILESYSTEM_DISK=do_spaces

# DigitalOcean Spaces
DO_SPACES_KEY=DO00334AG4DCYMLYXU7M
DO_SPACES_SECRET=s54HIoN+UmT8VJpBrULiiiymoIRLz1hK31D/QJZKamo
DO_SPACES_ENDPOINT=https://sgp1.digitaloceanspaces.com
DO_SPACES_REGION=sgp1
DO_SPACES_BUCKET=andromeda-catz
DO_SPACES_URL=https://andromeda-catz.sgp1.digitaloceanspaces.com

# =====================================================
# Mail Configuration
# =====================================================
MAIL_MAILER=smtp
MAIL_SCHEME=null
MAIL_HOST=                  # ← FILL THIS: Your SMTP host
MAIL_PORT=587
MAIL_USERNAME=              # ← FILL THIS: Your SMTP username
MAIL_PASSWORD=              # ← FILL THIS: Your SMTP password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@aru-learning.alfredoptarigan.tech"
MAIL_FROM_NAME="${APP_NAME}"

# =====================================================
# External APIs
# =====================================================
# YouTube API
YOUTUBE_API_KEY=AIzaSyCii89TGteYsnWq7oIv2d2JeTTt7gBdWiM

# Stripe Payment (CHANGE TO LIVE KEYS!)
STRIPE_KEY=                 # ← FILL THIS: pk_live_...
STRIPE_SECRET=              # ← FILL THIS: sk_live_...
STRIPE_WEBHOOK_SECRET=      # ← FILL THIS: whsec_...

# =====================================================
# Vite
# =====================================================
VITE_APP_NAME="${APP_NAME}"

# =====================================================
# Docker Specific
# =====================================================
APP_SEED=true               # ← Set to true for first deployment only
```

**To save in nano:**
- Press `Ctrl + O` (WriteOut)
- Press `Enter` (Confirm filename)
- Press `Ctrl + X` (Exit)

---

### Step 2.3: Generate Strong Passwords

Generate secure passwords for database and Redis:

```bash
# Generate database password
DB_PASS=$(openssl rand -base64 32)
echo "DB_PASSWORD=$DB_PASS"

# Generate Redis password
REDIS_PASS=$(openssl rand -base64 32)
echo "REDIS_PASSWORD=$REDIS_PASS"

# IMPORTANT: Copy these passwords and add them to .env file
```

**Copy the generated passwords and update your `.env` file:**

```bash
nano .env

# Find these lines and paste the generated passwords:
# DB_PASSWORD=paste_here
# REDIS_PASSWORD=paste_here
```

---

### Step 2.4: Configure Mail Settings (Optional but Recommended)

If using Gmail:

```bash
nano .env

# Update these values:
# MAIL_HOST=smtp.gmail.com
# MAIL_PORT=587
# MAIL_USERNAME=your-email@gmail.com
# MAIL_PASSWORD=your-app-password  # Not your regular password!
# MAIL_ENCRYPTION=tls
```

**How to get Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Create new app password
3. Use that password in MAIL_PASSWORD

---

### Step 2.5: Update Stripe Keys to Production

```bash
nano .env

# Update Stripe keys to LIVE keys:
# STRIPE_KEY=pk_live_YOUR_LIVE_KEY
# STRIPE_SECRET=sk_live_YOUR_LIVE_SECRET
# STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

**⚠️ IMPORTANT:** Never use test keys in production!

---

### Step 2.6: Set Proper File Permissions

```bash
# Set ownership
sudo chown -R $USER:$USER /var/www/aru-learning

# Verify
ls -la /var/www/aru-learning
# Should show your username as owner
```

---

## 🎯 PHASE 3: Build and Deploy

### Step 3.1: Build Docker Images

```bash
# Make sure you're in the application directory
cd /var/www/aru-learning

# Build Docker images (this may take 5-10 minutes)
docker compose build --no-cache

# You'll see output like:
# [+] Building 234.5s (45/45) FINISHED
```

**Expected output:**
```
[+] Building 234.5s (45/45) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 2.45kB
 => [internal] load .dockerignore
 => => transferring context: 542B
 ...
 => => naming to docker.io/library/aru-learning-app
```

---

### Step 3.2: Start Docker Containers

```bash
# Start all services in detached mode
docker compose up -d

# You should see:
# [+] Running 6/6
#  ✔ Network aru-learning_app_network    Created
#  ✔ Volume "aru-learning_postgres_data" Created
#  ✔ Volume "aru-learning_redis_data"    Created
#  ✔ Container aru-learning-postgres     Started
#  ✔ Container aru-learning-redis        Started
#  ✔ Container aru-learning-app          Started
```

---

### Step 3.3: Verify Services Are Running

```bash
# Check container status
docker compose ps

# Should show all containers as "Up"
```

**Expected output:**
```
NAME                    SERVICE    STATUS    PORTS
aru-learning-app        app        Up        9000/tcp
aru-learning-postgres   postgres   Up        5432/tcp
aru-learning-queue      queue      Up
aru-learning-redis      redis      Up        6379/tcp
aru-learning-scheduler  scheduler  Up
aru-learning-traefik    traefik    Up        0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
```

---

### Step 3.4: Check Logs

```bash
# View logs from all containers
docker compose logs

# View specific service logs
docker compose logs app
docker compose logs traefik

# Follow logs in real-time
docker compose logs -f
```

**Press `Ctrl+C` to stop following logs**

---

## 🎯 PHASE 4: Initialize Application

### Step 4.1: Check Application Key

The application key is automatically generated during container startup if not present.

```bash
# Verify the key was generated
docker compose exec app php artisan key:status

# If you need to regenerate manually:
# docker compose exec app php artisan key:generate --force
```

**Note:** The startup script automatically generates the APP_KEY if it's not set in your `.env` file.

---

### Step 4.2: Wait for Database to be Ready

```bash
# The startup script should handle this, but verify:
docker compose exec app php artisan db:monitor

# Output: Database connection successful!
```

**If it fails:**
```bash
# Wait a few seconds and try again
sleep 10
docker compose exec app php artisan db:monitor
```

---

### Step 4.3: Run Database Migrations

```bash
# Run migrations to create database tables
docker compose exec app php artisan migrate --force

# You'll see output like:
# Migration table created successfully.
# Migrating: 2014_10_12_000000_create_users_table
# Migrated:  2014_10_12_000000_create_users_table (123.45ms)
# ...
```

---

### Step 4.4: Run Database Seeders

```bash
# Seed the database with initial data
docker compose exec app php artisan db:seed --force

# You'll see:
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔑 Creating Permission Groups & Permissions
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ...
# ✓ Admin user created successfully!
# Email: alfredoptarigan@tech.com
# Password: Carthy1234
```

**⚠️ IMPORTANT:** Note down the admin credentials!

---

### Step 4.5: Optimize Application for Production

```bash
# Cache configuration
docker compose exec app php artisan config:cache

# Cache routes
docker compose exec app php artisan route:cache

# Cache views
docker compose exec app php artisan view:cache

# Cache events
docker compose exec app php artisan event:cache

# You should see: Configuration cached successfully! (for each command)
```

---

### Step 4.6: Create Storage Link

```bash
# Link storage directory for public access
docker compose exec app php artisan storage:link

# Output: The [public/storage] link has been connected to [storage/app/public].
```

---

### Step 4.7: Set Proper Permissions

```bash
# Set permissions from inside the container
docker compose exec -u root app chown -R www-data:www-data storage bootstrap/cache
docker compose exec -u root app chmod -R 775 storage bootstrap/cache
```

---

## 🎯 PHASE 5: Verification & Testing

### Step 5.1: Check Application Health

```bash
# Check if app container is healthy
docker compose exec app php artisan --version

# Output: Laravel Framework 12.48.1
```

---

### Step 5.2: Test Database Connection

```bash
# Test database connection
docker compose exec app php artisan db:monitor

# Output: Database connection successful!
```

---

### Step 5.3: Test Redis Connection

```bash
# Test Redis connection
docker compose exec app php artisan tinker

# Inside tinker, type:
Redis::ping();

# Output: "PONG"

# Type 'exit' to quit tinker
exit
```

---

### Step 5.4: Check HTTP Access

```bash
# Test HTTP response
curl -I http://localhost

# Or from your domain
curl -I https://aru-learning.alfredoptarigan.tech

# You should see:
# HTTP/2 200
# content-type: text/html; charset=UTF-8
```

---

### Step 5.5: Wait for SSL Certificate

Traefik will automatically obtain an SSL certificate from Let's Encrypt. This may take 1-2 minutes.

```bash
# Watch Traefik logs for certificate generation
docker compose logs -f traefik

# Look for messages like:
# "Serving default certificate for request"
# Then later:
# "certificate obtained successfully"

# Press Ctrl+C when done
```

---

### Step 5.6: Test HTTPS Access

```bash
# Test HTTPS (may take 1-2 minutes for SSL cert)
curl -I https://aru-learning.alfredoptarigan.tech

# Should show:
# HTTP/2 200
# server: traefik
```

---

### Step 5.7: Access the Application

Open your browser and navigate to:
```
https://aru-learning.alfredoptarigan.tech
```

**You should see the ARU Learning homepage!** 🎉

---

## 🎯 PHASE 6: First Login & Security

### Step 6.1: Login as Admin

1. Navigate to: `https://aru-learning.alfredoptarigan.tech/login`
2. Enter credentials:
   - **Email:** `alfredoptarigan@tech.com`
   - **Password:** `Carthy1234`

---

### Step 6.2: Change Admin Password (CRITICAL!)

**⚠️ IMMEDIATELY after first login:**

1. Go to Profile/Settings
2. Change password to a strong password
3. Use password manager to save it

**Or via command line:**

```bash
docker compose exec app php artisan tinker

# Inside tinker:
$user = App\Models\User::where('email', 'alfredoptarigan@tech.com')->first();
$user->password = bcrypt('YourNewStrongPassword123!@#');
$user->save();
exit
```

---

### Step 6.3: Disable Database Seeding for Future Deploys

```bash
# Edit .env file
nano .env

# Change this line:
APP_SEED=true
# To:
APP_SEED=false

# Save and exit (Ctrl+O, Enter, Ctrl+X)

# Restart containers to apply changes
docker compose restart app
```

---

## 🎯 PHASE 7: Monitoring & Maintenance

### Step 7.1: View Application Logs

```bash
# Follow application logs
docker compose logs -f app

# View last 100 lines
docker compose logs --tail=100 app

# View queue worker logs
docker compose logs -f queue
```

---

### Step 7.2: Monitor Container Resources

```bash
# Check resource usage
docker stats

# Shows CPU, Memory, Network usage for each container
# Press Ctrl+C to exit
```

---

### Step 7.3: Check Service Status

```bash
# List all running containers
docker compose ps

# Should show all services as "Up"
```

---

### Step 7.4: Test Email Sending (if configured)

```bash
docker compose exec app php artisan tinker

# Inside tinker:
Mail::raw('Test email from ARU Learning', function($message) {
    $message->to('your-email@example.com')
            ->subject('Test Email');
});

exit
```

---

## 🎯 PHASE 8: Backup Setup

### Step 8.1: Create Backup Script

```bash
# Create backup directory
sudo mkdir -p /var/backups/aru-learning

# Create backup script
sudo nano /usr/local/bin/backup-aru.sh
```

**Paste this content:**

```bash
#!/bin/bash

# ARU Learning Backup Script
BACKUP_DIR="/var/backups/aru-learning"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/aru-learning"

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Backup database
cd $APP_DIR
docker compose exec -T postgres pg_dump -U laravel aru_learning | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup storage files
tar -czf $BACKUP_DIR/storage_$DATE.tar.gz storage/app

# Backup environment
cp .env $BACKUP_DIR/env_$DATE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
find $BACKUP_DIR -name "env_*" -mtime +7 -delete

echo "Backup completed: $DATE"
```

**Save and exit, then make it executable:**

```bash
# Make script executable
sudo chmod +x /usr/local/bin/backup-aru.sh

# Test the backup
sudo /usr/local/bin/backup-aru.sh

# Check backups were created
ls -lh /var/backups/aru-learning/
```

---

### Step 8.2: Schedule Automatic Backups

```bash
# Edit crontab
sudo crontab -e

# Add this line at the end (daily backup at 2 AM):
0 2 * * * /usr/local/bin/backup-aru.sh >> /var/log/aru-backup.log 2>&1

# Save and exit
```

---

## 🎯 PHASE 9: Common Commands Reference

### Starting/Stopping Services

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Restart all services
docker compose restart

# Restart specific service
docker compose restart app
```

---

### Viewing Logs

```bash
# All logs
docker compose logs

# Specific service
docker compose logs app

# Follow logs (real-time)
docker compose logs -f app

# Last 50 lines
docker compose logs --tail=50 app
```

---

### Accessing Containers

```bash
# Access app container shell
docker compose exec app sh

# Access as root
docker compose exec -u root app sh

# Run Laravel commands
docker compose exec app php artisan <command>

# Examples:
docker compose exec app php artisan route:list
docker compose exec app php artisan queue:work
docker compose exec app php artisan tinker
```

---

### Database Operations

```bash
# Run migrations
docker compose exec app php artisan migrate

# Rollback last migration
docker compose exec app php artisan migrate:rollback

# Fresh migrations (DESTRUCTIVE!)
docker compose exec app php artisan migrate:fresh

# Access database directly
docker compose exec postgres psql -U laravel aru_learning
```

---

### Cache Management

```bash
# Clear all caches
docker compose exec app php artisan cache:clear
docker compose exec app php artisan config:clear
docker compose exec app php artisan route:clear
docker compose exec app php artisan view:clear

# Rebuild caches (production)
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
docker compose exec app php artisan view:cache
```

---

## 🎯 PHASE 10: Troubleshooting

### Problem: Containers won't start

```bash
# Check Docker daemon
sudo systemctl status docker

# Restart Docker
sudo systemctl restart docker

# Check logs
docker compose logs

# Rebuild and restart
docker compose down
docker compose build --no-cache
docker compose up -d
```

---

### Problem: Can't connect to database

```bash
# Check PostgreSQL is running
docker compose ps postgres

# View PostgreSQL logs
docker compose logs postgres

# Test connection
docker compose exec app php artisan db:monitor

# Restart database
docker compose restart postgres
```

---

### Problem: SSL certificate not working

```bash
# Check Traefik logs
docker compose logs traefik

# Verify DNS is configured
dig aru-learning.alfredoptarigan.tech

# Check ports are open
sudo ufw status
sudo netstat -tlnp | grep -E ':(80|443)'

# Restart Traefik
docker compose restart traefik
```

---

### Problem: Permission denied errors

```bash
# Fix storage permissions
docker compose exec -u root app chown -R www-data:www-data storage bootstrap/cache
docker compose exec -u root app chmod -R 775 storage bootstrap/cache
```

---

### Problem: "Failed to open stream: No such file or directory" for .env

This error occurs when the `.env` file is not in the container or not in the expected location.

**Solutions:**

```bash
# 1. Check if .env file exists on server
cat /var/www/aru-learning/.env

# If missing, copy from example:
cp /var/www/aru-learning/.env.example /var/www/aru-learning/.env
nano /var/www/aru-learning/.env  # Edit with your values

# 2. Rebuild containers with updated .env
docker compose down
docker compose build --no-cache
docker compose up -d

# 3. The startup script will automatically generate APP_KEY
docker compose logs app | grep "Application key"
```

**Why this happens:**
- `.env` file not created before building Docker images
- `.env` file not properly copied to container
- APP_KEY not set, causing key:generate to fail

---

### Problem: APP_KEY not set error

```bash
# Generate application key manually
docker compose exec app php artisan key:generate --force

# Verify it's set
docker compose exec app php artisan tinker
>>> env('APP_KEY');
# Should show: "base64:..."
>>> exit
```

---

### Problem: 502 Bad Gateway

```bash
# Check app container
docker compose ps app
docker compose logs app

# Restart app
docker compose restart app

# Check PHP-FPM
docker compose exec app php-fpm -t
```

---

## 🎯 PHASE 11: Updates & Redeployment

### Deploying Updates

```bash
# 1. Navigate to application directory
cd /var/www/aru-learning

# 2. Pull latest code
git pull origin main

# 3. Rebuild images
docker compose build --no-cache

# 4. Stop services
docker compose down

# 5. Start services
docker compose up -d

# 6. Run migrations (if any)
docker compose exec app php artisan migrate --force

# 7. Clear and rebuild caches
docker compose exec app php artisan optimize

# 8. Verify
curl -I https://aru-learning.alfredoptarigan.tech
```

---

## ✅ Deployment Complete Checklist

After completing all steps, verify:

- [ ] All Docker containers are running (`docker compose ps`)
- [ ] Database connection works (`docker compose exec app php artisan db:monitor`)
- [ ] Redis connection works
- [ ] Website accessible via HTTPS
- [ ] SSL certificate obtained (green padlock in browser)
- [ ] Admin login works
- [ ] Admin password changed from default
- [ ] Email sending works (if configured)
- [ ] Backups scheduled via cron
- [ ] Firewall configured (ports 80, 443, 22 only)
- [ ] APP_SEED=false in .env

---

## 🎉 SUCCESS!

Your ARU Learning platform is now live at:
**https://aru-learning.alfredoptarigan.tech**

**Default Admin Credentials:**
- Email: `alfredoptarigan@tech.com`
- Password: `Carthy1234` ⚠️ **CHANGE THIS IMMEDIATELY!**

---

## 📞 Support & Documentation

**For detailed information, see:**
- `README.docker.md` - Complete Docker guide
- `DOCKER_ENV_GUIDE.md` - Environment variables explained
- `QUICK_REFERENCE.md` - Quick command reference

**Need Help?**
- Email: alfredoptarigan@tech.com
- Check logs: `docker compose logs`

---

**Made with ❤️ by Pixel Edu Team**
