# 🚀 ARU Learning - Quick Reference Card

## 📦 Complete Production .env Template

```env
# ============================================
# COPY THIS TO YOUR PRODUCTION SERVER
# ============================================

# Application
APP_NAME="Pixel Edu"
APP_ENV=production
APP_KEY=                    # ← Run: docker-compose exec app php artisan key:generate
APP_DEBUG=false
APP_TIMEZONE=Asia/Jakarta
APP_URL=https://aru-learning.alfredoptarigan.tech

# Database (Docker)
DB_CONNECTION=pgsql
DB_HOST=postgres            # ← Docker service name (NOT localhost!)
DB_PORT=5432
DB_DATABASE=aru_learning
DB_USERNAME=laravel
DB_PASSWORD=                # ← Generate: openssl rand -base64 32

# Redis (Docker)
REDIS_CLIENT=phpredis
REDIS_HOST=redis            # ← Docker service name
REDIS_PORT=6379
REDIS_PASSWORD=             # ← Optional but recommended

# Cache & Session
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# DigitalOcean Spaces
FILESYSTEM_DISK=do_spaces
DO_SPACES_KEY=DO00334AG4DCYMLYXU7M
DO_SPACES_SECRET=s54HIoN+UmT8VJpBrULiiiymoIRLz1hK31D/QJZKamo
DO_SPACES_ENDPOINT=https://sgp1.digitaloceanspaces.com
DO_SPACES_REGION=sgp1
DO_SPACES_BUCKET=andromeda-catz
DO_SPACES_URL=https://andromeda-catz.sgp1.digitaloceanspaces.com

# Mail (Production SMTP)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com    # ← Your SMTP provider
MAIL_PORT=587
MAIL_USERNAME=              # ← Your email
MAIL_PASSWORD=              # ← App password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@aru-learning.alfredoptarigan.tech"
MAIL_FROM_NAME="${APP_NAME}"

# YouTube API
YOUTUBE_API_KEY=AIzaSyCii89TGteYsnWq7oIv2d2JeTTt7gBdWiM

# Stripe (PRODUCTION KEYS!)
STRIPE_KEY=pk_live_...                    # ← Change to LIVE key!
STRIPE_SECRET=sk_live_...                 # ← Change to LIVE key!
STRIPE_WEBHOOK_SECRET=whsec_...           # ← Production webhook secret

# Logging
LOG_LEVEL=error

# Vite
VITE_APP_NAME="${APP_NAME}"

# Docker
APP_SEED=false              # ← Only true for initial setup
```

---

## 🔑 Admin Credentials

```
Email:    alfredoptarigan@tech.com
Password: Carthy1234
⚠️  CHANGE PASSWORD IMMEDIATELY AFTER FIRST LOGIN!
```

---

## 🎯 Essential Commands

### Initial Deployment
```bash
# 1. Setup
cd /var/www && git clone <repo> aru-learning && cd aru-learning
cp .env.example .env && nano .env

# 2. Deploy
docker-compose build && docker-compose up -d

# 3. Initialize
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate --force
docker-compose exec app php artisan db:seed --force
docker-compose exec app php artisan optimize

# 4. Verify
curl -I https://aru-learning.alfredoptarigan.tech
```

### Daily Operations
```bash
make dev-up          # Start development
make prod-up         # Start production
make dev-logs        # View logs
make shell           # Access container
make db-backup       # Backup database
make optimize        # Optimize caches
```

---

## 🌐 Service URLs

### Production
- **App:** https://aru-learning.alfredoptarigan.tech
- **SSL:** Auto-configured via Let's Encrypt

### Development
- **App:** http://aru-learning.local
- **Traefik:** http://traefik.local
- **MailHog:** http://mail.local
- **pgAdmin:** http://db.local

---

## 🔧 Troubleshooting

### Can't connect to database?
```bash
docker-compose logs postgres
docker-compose exec app php artisan db:monitor
```

### SSL not working?
```bash
docker-compose logs traefik
# Check DNS: dig aru-learning.alfredoptarigan.tech
# Verify ports 80/443 are open
```

### Permission errors?
```bash
docker-compose exec -u root app chown -R www-data:www-data storage bootstrap/cache
```

---

## 📞 Support

- **Documentation:** README.docker.md
- **Environment Guide:** DOCKER_ENV_GUIDE.md
- **Email:** alfredoptarigan@tech.com
