#!/bin/bash

# ===================================================
# Comprehensive Diagnostic Script
# ===================================================
# Run this to diagnose ALL possible issues
# ===================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 ARU Learning - Full Diagnostic"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if running in correct directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found!"
    echo "   Current directory: $(pwd)"
    exit 1
fi

echo "📍 Directory: $(pwd)"
echo "📅 Time: $(date)"
echo ""

# ===================================================
# SECTION 1: Docker System Status
# ===================================================
echo "═════════════════════════════════════════"
echo "1️⃣ DOCKER SYSTEM STATUS"
echo "═════════════════════════════════════════"
echo ""

echo "🐋 Docker version:"
docker --version
echo ""

echo "📊 Docker Compose version:"
docker compose version
echo ""

echo "🔌 Docker daemon status:"
sudo systemctl is-active docker || echo "Docker daemon not running"
echo ""

echo "💾 Disk space:"
df -h | grep -E "(Filesystem|/$)"
echo ""

# ===================================================
# SECTION 2: Container Status
# ===================================================
echo "═════════════════════════════════════════"
echo "2️⃣ CONTAINER STATUS"
echo "═════════════════════════════════════════"
echo ""

echo "📋 All containers:"
docker compose ps
echo ""

echo "🔍 Detailed container inspection:"
docker compose ps -a
echo ""

# ===================================================
# SECTION 3: Environment File Check
# ===================================================
echo "═════════════════════════════════════════"
echo "3️⃣ ENVIRONMENT FILE CHECK"
echo "═════════════════════════════════════════"
echo ""

echo "📄 .env file exists:"
if [ -f ".env" ]; then
    echo "✅ Yes"
    echo "   Size: $(stat -f%z .env 2>/dev/null || stat -c%s .env) bytes"
    echo "   Lines: $(wc -l < .env)"
    echo ""
    echo "   First 10 lines:"
    head -10 .env | sed 's/^/   /'
    echo ""
    echo "   Checking for empty values:"
    grep "=.*$" .env | grep -v "^#" | grep "=\\s*$" | sed 's/^/   ⚠️  EMPTY: /' || echo "   ✅ No empty values found"
else
    echo "❌ NO - .env file is missing!"
    echo ""
    echo "   .env.example exists:"
    if [ -f ".env.example" ]; then
        echo "   ✅ Yes"
        echo ""
        echo "   Creating .env from .env.example..."
        cp .env.example .env
        echo "   ✅ .env created!"
    else
        echo "   ❌ NO - .env.example also missing!"
    fi
fi
echo ""

# ===================================================
# SECTION 4: Docker Compose Configuration
# ===================================================
echo "═════════════════════════════════════════"
echo "4️⃣ DOCKER COMPOSE CONFIGURATION"
echo "═════════════════════════════════════════"
echo ""

echo "🔍 Checking .env volume mount in docker-compose.yml:"
grep -A10 "volumes:" docker-compose.yml | grep -A3 "app:" | sed 's/^/   /'
echo ""

# ===================================================
# SECTION 5: Application Logs
# ===================================================
echo "═════════════════════════════════════════"
echo "5️⃣ APPLICATION LOGS"
echo "═════════════════════════════════════════"
echo ""

echo "📋 Last 50 lines of app logs:"
docker compose logs --tail=50 app 2>&1 | sed 's/^/   /'
echo ""

echo "🔍 Errors found in logs:"
docker compose logs app 2>&1 | grep -i -E "(error|exception|fatal|failed|failed to open|no such file)" | tail -20 | sed 's/^/   ⚠️  /' || echo "   ✅ No obvious errors found"
echo ""

# ===================================================
# SECTION 6: Database Status
# ===================================================
echo "═════════════════════════════════════════"
echo "6️⃣ DATABASE STATUS"
echo "═════════════════════════════════════════"
echo ""

echo "📋 PostgreSQL container status:"
docker compose ps postgres
echo ""

echo "📋 PostgreSQL logs (last 20 lines):"
docker compose logs --tail=20 postgres 2>&1 | sed 's/^/   /'
echo ""

echo "🔌 Testing database connection:"
if docker compose exec -T postgres pg_isready -U laravel 2>/dev/null; then
    echo "   ✅ Database is ready"
else
    echo "   ❌ Database is NOT ready"
fi
echo ""

# ===================================================
# SECTION 7: Redis Status
# ===================================================
echo "═════════════════════════════════════════"
echo "7️⃣ REDIS STATUS"
echo "═════════════════════════════════════════"
echo ""

echo "📋 Redis container status:"
docker compose ps redis
echo ""

echo "📋 Redis logs (last 10 lines):"
docker compose logs --tail=10 redis 2>&1 | sed 's/^/   /'
echo ""

# ===================================================
# SECTION 8: Inside Container Check
# ===================================================
echo "═════════════════════════════════════════"
echo "8️⃣ INSIDE APP CONTAINER CHECK"
echo "═════════════════════════════════════════"
echo ""

echo "📋 Files in /var/www/html/:"
docker compose exec -T app ls -la /var/www/html/ 2>&1 | sed 's/^/   /'
echo ""

echo "📄 Checking /var/www/html/.env in container:"
if docker compose exec -T app test -f /var/www/html/.env 2>/dev/null; then
    echo "   ✅ .env file EXISTS in container"
    echo ""
    echo "   First 5 lines in container:"
    docker compose exec -T app head -5 /var/www/html/.env 2>&1 | sed 's/^/   /'
else
    echo "   ❌ .env file DOES NOT EXIST in container"
    echo ""
    echo "   This is the ROOT CAUSE of the error!"
    echo "   Solution: The .env file must be mounted as a volume"
fi
echo ""

echo "📋 Checking APP_KEY in container:"
docker compose exec -T app grep "^APP_KEY=" /var/www/html/.env 2>/dev/null | sed 's/^/   /' || echo "   ⚠️  Cannot read APP_KEY"
echo ""

# ===================================================
# SECTION 9: Volume Mounts
# ===================================================
echo "═════════════════════════════════════════"
echo "9️⃣ VOLUME MOUNTS"
echo "═════════════════════════════════════════"
echo ""

echo "📋 App container volume mounts:"
docker inspect aru-learning-app 2>/dev/null | grep -A20 "Mounts" | sed 's/^/   /' || echo "   ⚠️  Cannot inspect app container"
echo ""

# ===================================================
# SECTION 10: Summary & Recommendations
# ===================================================
echo "═════════════════════════════════════════"
echo "🔟 SUMMARY & RECOMMENDATIONS"
echo "═════════════════════════════════════════"
echo ""

echo "📊 Issues found:"
echo ""

# Count issues
issues=0

# Check .env file on host
if [ ! -f ".env" ]; then
    echo "   ❌ 1. .env file missing on host"
    ((issues++))
fi

# Check .env in container
if ! docker compose exec -T app test -f /var/www/html/.env 2>/dev/null; then
    echo "   ❌ 2. .env file not mounted in container"
    ((issues++))
fi

# Check if app container is running
if ! docker compose ps app | grep -q "Up"; then
    echo "   ❌ 3. App container not running or restarting"
    ((issues++))
fi

# Check if postgres is ready
if ! docker compose exec -T postgres pg_isready -U laravel 2>/dev/null; then
    echo "   ❌ 4. Database not ready"
    ((issues++))
fi

if [ $issues -eq 0 ]; then
    echo "   ✅ No critical issues found!"
else
    echo ""
    echo "⚠️  Total issues: $issues"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Diagnostic completed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📤 Copy this entire output and share it for further help"
echo ""
