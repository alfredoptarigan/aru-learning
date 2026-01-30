# 🐳 Docker Deployment Guide

## Architecture

```
Internet (80/443)
       ↓
    Nginx (SSL)
       ↓
   PHP-FPM (Laravel)
       ↓
PostgreSQL + Redis
```

## Quick Start

### 1. Setup Environment

```bash
cp .env.example .env
nano .env
```

Update these values:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://aru-learning.alfredoptarigan.tech

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_DATABASE=aru_learning
DB_USERNAME=laravel
DB_PASSWORD=your-secure-password

REDIS_HOST=redis

APP_SEED=true  # Set to true on first deploy
```

### 2. Deploy

```bash
./deploy.sh init
```

This will:
1. Build and start containers
2. Get SSL certificate from Let's Encrypt
3. Configure HTTPS
4. Start auto-renewal

### 3. Verify

```bash
./deploy.sh status
curl -I https://aru-learning.alfredoptarigan.tech
```

## Commands

| Command | Description |
|---------|-------------|
| `./deploy.sh init` | Initial deployment with SSL setup |
| `./deploy.sh start` | Start services |
| `./deploy.sh stop` | Stop services |
| `./deploy.sh update` | Pull and rebuild |
| `./deploy.sh status` | Show container status |
| `./deploy.sh logs` | View all logs |
| `./deploy.sh logs nginx` | View nginx logs |
| `./deploy.sh renew-ssl` | Renew SSL certificate |
| `./deploy.sh artisan migrate` | Run artisan command |

## Manual Docker Commands

```bash
# Build
docker compose build

# Start
docker compose up -d

# Stop
docker compose down

# Logs
docker compose logs -f [service]

# Shell access
docker compose exec app sh
docker compose exec postgres psql -U laravel
```

## Files Structure

```
docker/
├── nginx/
│   ├── default.conf      # Nginx server config (HTTPS)
│   └── default-http.conf # HTTP-only config (initial setup)
├── php/
│   ├── php.ini           # PHP settings
│   └── php-fpm.conf      # PHP-FPM pool config
└── scripts/
    └── startup.sh        # Container startup script

docker-compose.yml        # Main compose file
Dockerfile               # App image build
deploy.sh                # Deployment helper script
```

## SSL Certificate

- **Provider**: Let's Encrypt
- **Auto-renewal**: Every 12 hours (via certbot container)
- **Manual renewal**: `./deploy.sh renew-ssl`

## Troubleshooting

### 502 Bad Gateway
```bash
docker compose logs app
docker compose restart app
```

### Database connection error
```bash
docker compose exec postgres pg_isready -U laravel
docker compose logs postgres
```

### SSL certificate issues
```bash
# Check certificate
docker compose exec nginx ls /etc/letsencrypt/live/

# Force renewal
docker compose run --rm certbot renew --force-renewal
docker compose restart nginx
```

### View all logs
```bash
docker compose logs -f
```

## Prerequisites

- Docker & Docker Compose
- Domain pointing to server IP
- Ports 80 & 443 open

```bash
# Check DNS
nslookup aru-learning.alfredoptarigan.tech

# Check ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```
