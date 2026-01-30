# 🐳 ARU Learning - Docker Deployment Guide

Complete guide for deploying ARU Learning platform using Docker, Docker Compose, and Traefik.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [Common Commands](#common-commands)
- [Architecture](#architecture)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Backup & Restore](#backup--restore)

---

## 🔧 Prerequisites

### Required Software
- **Docker**: 24.0+ ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose**: v2.0+ (included with Docker Desktop)
- **Make**: For convenient commands (optional but recommended)

### System Requirements
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Storage**: Minimum 10GB free space
- **Ports**: 80, 443 (production), 5173, 8080 (development)

### Server Requirements (Production)
- Ubuntu 22.04 LTS or similar Linux distribution
- Domain name with DNS configured
- Ports 80 and 443 accessible from internet

---

## 🚀 Quick Start

### For Development

```bash
# 1. Clone repository
git clone <repository-url>
cd aru-learning

# 2. Run installation
make install

# 3. Access application
# App:      http://aru-learning.local
# Traefik:  http://traefik.local
# MailHog:  http://mail.local
# pgAdmin:  http://db.local
```

### For Production

```bash
# 1. Clone repository
cd /var/www
git clone <repository-url> aru-learning
cd aru-learning

# 2. Configure environment
cp .env.example .env
nano .env  # Edit production values

# 3. Build and deploy
make prod-build
make prod-up

# 4. Generate app key
docker-compose exec app php artisan key:generate

# 5. Run migrations and seeders
docker-compose exec app php artisan migrate --force
docker-compose exec app php artisan db:seed --force

# 6. Optimize for production
make optimize

# 7. Access application
# https://aru-learning.alfredoptarigan.tech
```

---

## 💻 Development Setup

### Step 1: Initial Setup

```bash
# Copy development environment file
cp .env.docker .env

# Start development services
make dev-up

# Install dependencies
docker-compose exec app composer install

# Generate application key
docker-compose exec app php artisan key:generate

# Run migrations and seeders
docker-compose exec app php artisan migrate:fresh --seed
```

### Step 2: Configure Hosts File

Add these entries to `/etc/hosts` (Linux/Mac) or `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
127.0.0.1 aru-learning.local
127.0.0.1 traefik.local
127.0.0.1 mail.local
127.0.0.1 db.local
```

### Step 3: Access Services

| Service | URL | Description |
|---------|-----|-------------|
| **Application** | http://aru-learning.local | Main Laravel app |
| **Vite Dev Server** | http://aru-learning.local:5173 | Hot reload frontend |
| **Traefik Dashboard** | http://traefik.local | Reverse proxy dashboard |
| **MailHog** | http://mail.local | Email testing interface |
| **pgAdmin** | http://db.local | PostgreSQL admin interface |

### Development Workflow

```bash
# Start development environment
make dev-up

# View logs (all services)
make dev-logs

# View specific service logs
docker-compose logs -f app
docker-compose logs -f vite

# Access container shell
make shell

# Run Laravel commands
docker-compose exec app php artisan route:list
docker-compose exec app php artisan tinker

# Run tests
make test

# Stop environment
make dev-down
```

---

## 🌐 Production Deployment

### Step 1: Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose (if not included)
sudo apt install docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

### Step 2: DNS Configuration

Configure your domain's DNS with an A record:

```
Type: A
Name: aru-learning
Value: <your-server-ip>
TTL: 3600
```

Wait for DNS propagation (can take up to 48 hours, usually much faster).

### Step 3: Application Deployment

```bash
# Clone repository
cd /var/www
sudo git clone <repository-url> aru-learning
cd aru-learning

# Set ownership
sudo chown -R $USER:$USER /var/www/aru-learning

# Configure environment
cp .env.example .env
nano .env

# Important: Configure these variables
# APP_ENV=production
# APP_DEBUG=false
# APP_KEY=  # Will be generated
# APP_URL=https://aru-learning.alfredoptarigan.tech
# DB_PASSWORD=<strong-password>
# REDIS_PASSWORD=<strong-password> (optional)

# Build production images
docker compose build --no-cache

# Start services
docker compose up -d

# Wait for services to start
sleep 30

# Generate application key
docker compose exec app php artisan key:generate

# Run migrations
docker compose exec app php artisan migrate --force

# Run seeders (creates admin user)
docker compose exec app php artisan db:seed --force

# Optimize application
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
docker compose exec app php artisan view:cache
docker compose exec app php artisan event:cache

# Set proper permissions
docker compose exec -u root app chown -R www-data:www-data storage bootstrap/cache
```

### Step 4: SSL Certificate

Traefik automatically obtains SSL certificates from Let's Encrypt. This happens automatically when:
1. Domain DNS is properly configured
2. Ports 80 and 443 are accessible
3. Email is configured in `docker/traefik/traefik.yml`

Certificate will be stored in `/letsencrypt/acme.json` inside the Traefik container.

### Step 5: Verify Deployment

```bash
# Check service status
docker compose ps

# Check logs
docker compose logs -f app

# Test HTTPS
curl -I https://aru-learning.alfredoptarigan.tech

# Access admin panel
# Email: alfredoptarigan@tech.com
# Password: Carthy1234
# IMPORTANT: Change password after first login!
```

---

## 📝 Common Commands

### Using Makefile

```bash
# Show all available commands
make help

# Development
make install          # Initial development setup
make dev-up          # Start development environment
make dev-down        # Stop development environment
make dev-logs        # Show development logs

# Production
make prod-build      # Build production images
make prod-up         # Start production environment
make prod-down       # Stop production environment
make prod-logs       # Show production logs

# Database
make db-migrate      # Run migrations
make db-seed         # Run seeders
make db-fresh        # Fresh migration with seed
make db-backup       # Backup database

# Cache
make cache-clear     # Clear all caches
make optimize        # Optimize for production

# Access
make shell           # Access app container
make tinker          # Laravel tinker
make logs-app        # App logs
make logs-queue      # Queue worker logs

# Testing
make test            # Run tests

# Cleanup
make clean           # Remove containers and volumes
make prune           # Prune Docker system
```

### Direct Docker Commands

```bash
# Service management
docker compose up -d                    # Start all services
docker compose down                     # Stop all services
docker compose restart                  # Restart all services
docker compose ps                       # List services

# Logs
docker compose logs -f                  # All logs
docker compose logs -f app              # App logs
docker compose logs -f postgres         # Database logs

# Execute commands
docker compose exec app php artisan <command>
docker compose exec app composer <command>
docker compose exec postgres psql -U laravel aru_learning

# Build
docker compose build                    # Build all images
docker compose build --no-cache app     # Rebuild specific service
```

---

## 🏗️ Architecture

### Services Overview

```
┌─────────────────────────────────────────────┐
│         Traefik (Port 80/443)               │
│    (Reverse Proxy + SSL Termination)        │
└─────────────┬───────────────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼────┐         ┌────▼────┐
│  App   │         │  Vite   │
│ (PHP)  │         │  (Dev)  │
└───┬────┘         └─────────┘
    │
    ├──────┬──────────┬──────────┐
    │      │          │          │
┌───▼──┐ ┌─▼──┐  ┌───▼────┐ ┌───▼──────┐
│Queue │ │Sched│ │Postgres│ │  Redis   │
│Worker│ │uler │ │        │ │          │
└──────┘ └─────┘ └────────┘ └──────────┘
```

### Container Details

| Container | Image | Purpose | Port |
|-----------|-------|---------|------|
| **traefik** | traefik:v3.0 | Reverse proxy, SSL | 80, 443 |
| **app** | Custom (PHP 8.4) | Laravel application | 9000 |
| **postgres** | postgres:17-alpine | Database | 5432 |
| **redis** | redis:7-alpine | Cache, sessions, queue | 6379 |
| **queue** | Custom (PHP 8.4) | Queue worker | - |
| **scheduler** | Custom (PHP 8.4) | Cron scheduler | - |
| **vite** | node:24-alpine | Dev server (dev only) | 5173 |
| **mailhog** | mailhog/mailhog | Email testing (dev only) | 1025, 8025 |
| **pgadmin** | dpage/pgadmin4 | DB admin (dev only) | 5050 |

### Network

All services are connected via `app_network` bridge network, allowing internal communication.

### Volumes

| Volume | Purpose | Persistence |
|--------|---------|-------------|
| **postgres_data** | Database files | ✅ Persistent |
| **redis_data** | Redis data (AOF) | ✅ Persistent |
| **traefik_certs** | SSL certificates | ✅ Persistent |

---

## 🔐 Environment Variables

### Critical Variables (Production)

```env
APP_KEY=                    # Generate with: php artisan key:generate
APP_ENV=production          # Set to production
APP_DEBUG=false            # MUST be false in production
APP_URL=https://aru-learning.alfredoptarigan.tech

DB_PASSWORD=               # Strong password for database
REDIS_PASSWORD=            # Optional but recommended

MAIL_HOST=                 # SMTP host
MAIL_USERNAME=             # SMTP username
MAIL_PASSWORD=             # SMTP password
```

### Optional Variables

```env
APP_SEED=false            # Set to true to run seeders on startup
LOG_LEVEL=error           # Logging level
CACHE_PREFIX=             # Cache key prefix
```

---

## 🔍 Troubleshooting

### Services Won't Start

```bash
# Check Docker daemon
sudo systemctl status docker

# Check service logs
docker compose logs

# Rebuild containers
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
docker compose ps postgres

# Check logs
docker compose logs postgres

# Verify environment variables
docker compose exec app env | grep DB_

# Test connection
docker compose exec app php artisan db:monitor
```

### SSL Certificate Issues

```bash
# Check Traefik logs
docker compose logs traefik

# Verify DNS resolution
dig aru-learning.alfredoptarigan.tech

# Check ports are accessible
sudo ufw status  # If using UFW firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Manual certificate renewal
docker compose exec traefik traefik --providers.acme.email=alfredoptarigan@tech.com
```

### Permission Issues

```bash
# Fix storage permissions
docker compose exec -u root app chown -R www-data:www-data storage bootstrap/cache
docker compose exec -u root app chmod -R 775 storage bootstrap/cache

# Fix file ownership
sudo chown -R $USER:$USER .
```

### 502 Bad Gateway

```bash
# Check app container status
docker compose ps app

# Check app logs
docker compose logs app

# Verify PHP-FPM is running
docker compose exec app php-fpm -t

# Restart app
docker compose restart app
```

---

## 💾 Backup & Restore

### Database Backup

```bash
# Create backup
make db-backup

# Or manually
docker compose exec postgres pg_dump -U laravel aru_learning > backup_$(date +%Y%m%d_%H%M%S).sql

# Compress backup
gzip backup_*.sql
```

### Database Restore

```bash
# Restore from backup
docker compose exec -T postgres psql -U laravel aru_learning < backup.sql

# Or with gunzip
gunzip -c backup.sql.gz | docker compose exec -T postgres psql -U laravel aru_learning
```

### Full Backup Strategy

```bash
#!/bin/bash
# backup.sh - Complete backup script

BACKUP_DIR="/var/backups/aru-learning"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
docker compose exec postgres pg_dump -U laravel aru_learning | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup uploaded files
tar -czf $BACKUP_DIR/storage_$DATE.tar.gz storage/app

# Backup environment
cp .env $BACKUP_DIR/env_$DATE

# Keep only last 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

### Automated Backups (Cron)

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /var/www/aru-learning && /bin/bash backup.sh
```

---

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## 📞 Support

For issues or questions:
- Email: alfredoptarigan@tech.com
- GitHub Issues: [Repository Issues]

---

**Made with ❤️ by Pixel Edu Team**
