# 🔧 Docker Environment Variables - Complete Guide

## ❓ How Do I Know the DB_HOST, DB_PORT, etc. on Server?

---

## 📘 Understanding Docker Networking

### **The Magic of Docker Service Names**

When you use Docker Compose, services can communicate with each other using **service names** as hostnames. Docker automatically resolves these names to the correct container IP addresses.

---

## 🎯 Quick Answer

**For Docker deployment (both development AND production):**

```env
# These values are ALWAYS the same in Docker:
DB_HOST=postgres          # ← Docker service name (not 'localhost'!)
DB_PORT=5432              # ← Default PostgreSQL port
DB_DATABASE=aru_learning  # ← Your database name
DB_USERNAME=laravel       # ← Your database user
DB_PASSWORD=your_password # ← Set your own strong password

REDIS_HOST=redis          # ← Docker service name (not 'localhost'!)
REDIS_PORT=6379           # ← Default Redis port
```

---

## 📊 Detailed Explanation

### **Scenario 1: Inside Docker Containers** ✅ (Your app runs here)

```yaml
# docker-compose.yml defines services:
services:
  app:          # ← Your Laravel app
  postgres:     # ← Database service
  redis:        # ← Cache service
```

**From inside the `app` container:**
- To connect to database: Use `DB_HOST=postgres`
- To connect to Redis: Use `REDIS_HOST=redis`
- Docker DNS automatically resolves these names!

```
┌─────────────────────────────────────┐
│  Docker Network (app_network)      │
│                                     │
│  ┌─────┐    connects to   ┌──────┐│
│  │ app │ ────────────────▶ │postgres│
│  └─────┘   "postgres"     └──────┘│
│     │                              │
│     └──────────────────▶ ┌──────┐ │
│        "redis"           │redis │ │
│                          └──────┘ │
└─────────────────────────────────────┘
```

---

### **Scenario 2: From Your Host Machine** 💻 (When NOT using Docker)

If you want to connect directly from your host machine (e.g., using TablePlus, Beekeeper Studio, or `psql`):

```env
# Use localhost and exposed ports
DB_HOST=127.0.0.1  # or localhost
DB_PORT=5432       # Port exposed in docker-compose.yml
```

**Why?** Because the ports are mapped from container to host:

```yaml
# In docker-compose.yml:
postgres:
  ports:
    - "5432:5432"  # host:container
    #   ^^^^  ^^^^
    #   │     └─ Container's internal port
    #   └─ Your computer's port
```

---

## 🌍 Environment Variables for Different Scenarios

### **Development (Docker)**

```env
# .env.docker
APP_URL=http://aru-learning.local

DB_HOST=postgres        # ← Docker service name
DB_PORT=5432
DB_DATABASE=aru_learning
DB_USERNAME=laravel
DB_PASSWORD=secret

REDIS_HOST=redis        # ← Docker service name
REDIS_PORT=6379

MAIL_HOST=mailhog       # ← Docker service name (MailHog for testing)
MAIL_PORT=1025
```

---

### **Production Server (Docker)**

```env
# .env (production)
APP_URL=https://aru-learning.alfredoptarigan.tech

DB_HOST=postgres        # ← SAME! Docker service name
DB_PORT=5432
DB_DATABASE=aru_learning
DB_USERNAME=laravel
DB_PASSWORD=super_secure_production_password_here

REDIS_HOST=redis        # ← SAME! Docker service name
REDIS_PORT=6379
REDIS_PASSWORD=also_secure_password

MAIL_HOST=smtp.gmail.com  # ← Real SMTP server
MAIL_PORT=587
```

**Key Point:** The connection strings are **identical** between dev and prod when using Docker! Only passwords and external services change.

---

### **Local Development (Without Docker)**

If you're running Laravel directly on your machine (without Docker):

```env
# .env (local non-Docker)
APP_URL=http://localhost:8000

DB_HOST=127.0.0.1       # ← localhost
DB_PORT=5432
DB_DATABASE=aru_learning
DB_USERNAME=alfredo     # ← Your local username
DB_PASSWORD=            # ← Your local password

REDIS_HOST=127.0.0.1    # ← localhost
REDIS_PORT=6379
```

---

## 🔍 How to Find Connection Details

### **Method 1: Check docker-compose.yml**

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: ${DB_DATABASE:-aru_learning}      # ← Database name
      POSTGRES_USER: ${DB_USERNAME:-laravel}         # ← Username
      POSTGRES_PASSWORD: ${DB_PASSWORD}              # ← From .env
    ports:
      - "5432:5432"  # ← Port mapping
```

**Service name:** `postgres` (this becomes the hostname)  
**Port:** `5432` (standard PostgreSQL port)  
**Database/User/Password:** From your `.env` file

---

### **Method 2: Inspect Running Container**

```bash
# Get container details
docker-compose ps

# Output:
NAME                    SERVICE    STATUS
aru-learning-postgres   postgres   Up 2 hours
aru-learning-redis      redis      Up 2 hours
aru-learning-app        app        Up 2 hours

# Get network information
docker inspect aru-learning-postgres | grep IPAddress

# Output:
"IPAddress": "172.18.0.3"  # ← Internal Docker IP (you don't need this!)
```

**You don't need the IP!** Just use the service name: `postgres`

---

### **Method 3: Test Connection from App Container**

```bash
# Access app container
docker-compose exec app sh

# Test database connection
php artisan db:monitor

# Test Redis connection
php artisan tinker
>>> \Illuminate\Support\Facades\Redis::connection()->ping();
# Output: "PONG"
```

---

## 🎓 Real-World Example

### **Connecting from Different Locations**

```
┌──────────────────────────────────────────────────────┐
│                    YOUR SERVER                        │
│                                                       │
│  ┌────────────────────────────────────────────────┐ │
│  │       Docker Network (172.18.0.0/16)           │ │
│  │                                                 │ │
│  │   app container                                │ │
│  │   DB_HOST=postgres  ✅ Works!                  │ │
│  │   DB_PORT=5432                                 │ │
│  │   ├─connects to─▶ postgres container           │ │
│  │                                                 │ │
│  └────────────────────────────────────────────────┘ │
│                                                       │
│  Outside Docker (your SSH session)                   │
│  DB_HOST=localhost   ✅ Works! (port 5432 exposed)  │
│  DB_PORT=5432                                        │
│  └─connects to─▶ 127.0.0.1:5432 ─▶ postgres         │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│              YOUR LOCAL COMPUTER                      │
│                                                       │
│  TablePlus / Beekeeper Studio / Any DB Client        │
│  DB_HOST=aru-learning.alfredoptarigan.tech           │
│  DB_PORT=5432                                        │
│  └─connects via Internet─▶ Server:5432               │
│    ⚠️  ONLY IF port is exposed (NOT recommended!)    │
└──────────────────────────────────────────────────────┘
```

---

## 🔒 Security Best Practices

### **1. Don't Expose Database Ports Publicly**

```yaml
# ❌ BAD - Accessible from anywhere
postgres:
  ports:
    - "5432:5432"

# ✅ GOOD - Only accessible via Docker network
postgres:
  # No ports section = only internal access
  expose:
    - 5432
```

For production, **remove** the `ports` section from postgres and redis. Only the app needs to connect to them!

---

### **2. Use Strong Passwords**

```bash
# Generate strong password
openssl rand -base64 32

# Example output:
5K8vY9mN2pQ7wX3zR6tH4jL1cF0aS8bV9nM7qW2eU5yT3xR1=

# Use in .env:
DB_PASSWORD=5K8vY9mN2pQ7wX3zR6tH4jL1cF0aS8bV9nM7qW2eU5yT3xR1=
```

---

### **3. Firewall Configuration**

```bash
# Allow only HTTP/HTTPS from outside
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Database and Redis only accessible internally (via Docker)
# NO need to allow ports 5432 or 6379!
```

---

## 📝 Complete Environment Setup Examples

### **Example 1: Fresh Production Deployment**

```bash
# 1. Clone repository
cd /var/www
git clone <repo> aru-learning
cd aru-learning

# 2. Copy environment template
cp .env.example .env

# 3. Edit environment variables
nano .env

# Set these values:
APP_ENV=production
APP_DEBUG=false
APP_URL=https://aru-learning.alfredoptarigan.tech

DB_HOST=postgres              # ← Docker service name
DB_PASSWORD=YOUR_STRONG_PASS  # ← Generate with: openssl rand -base64 32

REDIS_HOST=redis              # ← Docker service name
REDIS_PASSWORD=ANOTHER_PASS   # ← Optional but recommended

# Add your API keys:
DO_SPACES_KEY=DO00334AG4DCYMLYXU7M
DO_SPACES_SECRET=s54HIoN+UmT8VJpBrULiiiymoIRLz1hK31D/QJZKamo
YOUTUBE_API_KEY=AIzaSy...
STRIPE_KEY=pk_live_...        # ← Use LIVE keys in production!
STRIPE_SECRET=sk_live_...

# 4. Deploy
docker-compose up -d

# 5. Initialize
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate --force
docker-compose exec app php artisan db:seed --force
docker-compose exec app php artisan optimize
```

---

### **Example 2: Connect to Production Database**

**From your local computer using SSH tunnel:**

```bash
# Create SSH tunnel
ssh -L 5432:localhost:5432 user@aru-learning.alfredoptarigan.tech

# Now connect with DB client to:
Host: localhost
Port: 5432
Database: aru_learning
Username: laravel
Password: YOUR_PRODUCTION_PASSWORD
```

**Security:** Database is never exposed to internet! ✅

---

## 🎯 Quick Reference Card

### **Always Use These in Docker:**

| Variable | Development | Production | Why? |
|----------|-------------|------------|------|
| `DB_HOST` | `postgres` | `postgres` | Docker service name |
| `DB_PORT` | `5432` | `5432` | Standard PostgreSQL |
| `REDIS_HOST` | `redis` | `redis` | Docker service name |
| `REDIS_PORT` | `6379` | `6379` | Standard Redis |
| `MAIL_HOST` | `mailhog` | `smtp.gmail.com` | MailHog (dev) vs Real SMTP (prod) |

### **Different Between Environments:**

| Variable | Development | Production |
|----------|-------------|------------|
| `APP_ENV` | `local` | `production` |
| `APP_DEBUG` | `true` | `false` |
| `APP_URL` | `http://aru-learning.local` | `https://aru-learning.alfredoptarigan.tech` |
| `DB_PASSWORD` | `secret` | Strong random password |
| Stripe Keys | Test keys | Live keys |

---

## ✅ Verification Commands

### **Test all connections from inside container:**

```bash
# Access app container
docker-compose exec app sh

# Test database
php artisan db:monitor
# Output: Database connection successful!

# Test Redis
php artisan tinker
>>> Redis::ping()
# Output: "PONG"

# Test filesystem (DigitalOcean Spaces)
php artisan tinker
>>> Storage::disk('do_spaces')->exists('test.txt')

# Test environment
php artisan config:show database.connections.pgsql.host
# Output: "postgres"
```

---

## 🚨 Common Mistakes

### **❌ Mistake 1: Using 'localhost' in Docker**

```env
# WRONG!
DB_HOST=localhost  # ← This won't work in Docker!
```

**Why it fails:** Inside a container, `localhost` refers to the container itself, not other containers.

**Solution:** Use service names:
```env
DB_HOST=postgres   # ✅ Correct!
```

---

### **❌ Mistake 2: Using Container IP Address**

```env
# WRONG!
DB_HOST=172.18.0.3  # ← IP changes every restart!
```

**Why it fails:** Container IPs are dynamic and change on restart.

**Solution:** Always use service names.

---

### **❌ Mistake 3: Exposing Database Publicly**

```yaml
# DANGEROUS!
postgres:
  ports:
    - "0.0.0.0:5432:5432"  # ← Exposed to internet!
```

**Solution:** Remove ports section in production:
```yaml
postgres:
  expose:
    - 5432  # ← Only internal access
```

---

## 🎉 Summary

**Remember:**
1. ✅ Use **service names** as hostnames in Docker (e.g., `postgres`, `redis`)
2. ✅ These are **the same** in development and production
3. ✅ Only passwords and API keys change between environments
4. ✅ Don't expose database ports publicly in production
5. ✅ Use strong passwords in production
6. ✅ Test connections with `php artisan db:monitor`

**Your values:**
```env
DB_HOST=postgres       # ← Always this in Docker
DB_PORT=5432           # ← Always this
REDIS_HOST=redis       # ← Always this
REDIS_PORT=6379        # ← Always this
```

---

**Still confused? Run this test:**

```bash
# Start your Docker environment
docker-compose up -d

# Access app container
docker-compose exec app sh

# Ping database
ping postgres
# You'll see it resolves to an IP!

# Test connection
php artisan db:monitor
# Should say: "Database connection successful!"
```

If this works, you're all set! 🚀
