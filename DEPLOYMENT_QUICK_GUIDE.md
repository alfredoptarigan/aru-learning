# 🚀 Quick Fix - 404 & No HTTPS

## Masalah
- ✗ 165.232.164.234 → 404 Not Found
- ✗ No HTTPS/SSL

## Penyebab
PHP-FPM bukan web server. Traefik butuh Nginx.

## Solusi (Sudah Diterapkan)
1. ✅ Tambah Nginx container
2. ✅ Konfigurasi: Traefik → Nginx → PHP-FPM
3. ✅ Let's Encrypt auto-provision

## Deploy di Server

```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild & restart
docker compose down
docker compose build --no-cache  
docker compose up -d

# 3. Check status
docker compose ps
```

## Prerequisites

### DNS Setup (PENTING!)
```bash
# Cek DNS pointing ke server
nslookup aru-learning.alfredoptarigan.tech
# Expected: 165.232.164.234
```

**Setup A Record di domain registrar:**
- Name: `aru-learning`
- Type: `A` 
- Value: `165.232.164.234`
- TTL: 300

### Firewall
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Verify

```bash
# Test HTTP (should work immediately)
curl -I http://165.232.164.234

# Test domain HTTP
curl -I http://aru-learning.alfredoptarigan.tech

# Test HTTPS (after DNS propagate)
curl -I https://aru-learning.alfredoptarigan.tech

# Check logs
docker compose logs nginx
docker compose logs traefik
```

## Let's Encrypt SSL

**Auto-provision pada first HTTPS request:**
1. DNS must be pointing correctly
2. Port 80 & 443 open
3. Traefik akan request certificate
4. Takes 1-2 minutes
5. Auto-renew sebelum expired

**Check certificate:**
```bash
docker compose logs traefik | grep -i certificate
```

## Troubleshooting

### Still 404?
```bash
docker compose logs nginx
docker compose restart nginx
docker compose exec nginx ping aru-learning-app
```

### No HTTPS?
```bash
# DNS belum propagate (tunggu max 1 jam)
nslookup aru-learning.alfredoptarigan.tech

# Restart Traefik
docker compose restart traefik
docker compose logs traefik
```

### Database issues?
```bash
./reset-database.sh
```

## Files Changed
- `docker/nginx/default.conf` (NEW)
- `docker-compose.yml` (added nginx service)
- `deploy.sh` (NEW helper script)
- `docker/php/php-fpm.conf` (fixed config)
- `docker/scripts/startup.sh` (fixed db check)

## Next Steps
1. ✅ Deploy changes to server
2. ✅ Setup DNS A record
3. ✅ Open firewall ports 80 & 443
4. ⏳ Wait for DNS propagation (5-60 min)
5. ✅ Access https://aru-learning.alfredoptarigan.tech
