.PHONY: help install dev-up dev-down dev-logs prod-build prod-up prod-down prod-logs db-migrate db-seed db-fresh cache-clear optimize shell tinker test

.DEFAULT_GOAL := help

# Colors for output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
BLUE   := \033[0;34m
NC     := \033[0m # No Color

help: ## Show this help message
	@echo '$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)'
	@echo '$(BLUE)   🐳 ARU LEARNING - Docker Commands   $(NC)'
	@echo '$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)'
	@echo ''
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ''

# =====================================================
# Installation & Setup
# =====================================================
install: ## Initial setup for development
	@echo '$(BLUE)📦 Installing ARU Learning...$(NC)'
	cp .env.docker .env
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
	@echo '$(YELLOW)⏳ Waiting for services to start...$(NC)'
	sleep 10
	docker-compose exec app composer install
	docker-compose exec app php artisan key:generate
	docker-compose exec app php artisan migrate:fresh --seed
	@echo ''
	@echo '$(GREEN)✅ Installation complete!$(NC)'
	@echo ''
	@echo '$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)'
	@echo '$(GREEN)🌐 Application URLs:$(NC)'
	@echo '   App:      http://aru-learning.local'
	@echo '   Traefik:  http://traefik.local'
	@echo '   MailHog:  http://mail.local'
	@echo '   pgAdmin:  http://db.local'
	@echo '$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)'

# =====================================================
# Development Commands
# =====================================================
dev-up: ## Start development environment
	@echo '$(BLUE)🚀 Starting development environment...$(NC)'
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
	@echo '$(GREEN)✅ Development environment started!$(NC)'
	@make dev-urls

dev-down: ## Stop development environment
	@echo '$(YELLOW)🛑 Stopping development environment...$(NC)'
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

dev-restart: ## Restart development environment
	@make dev-down
	@make dev-up

dev-logs: ## Show development logs (follow)
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

dev-urls: ## Show development URLs
	@echo ''
	@echo '$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)'
	@echo '$(GREEN)🌐 Development URLs:$(NC)'
	@echo '   App:      http://aru-learning.local'
	@echo '   Vite:     http://aru-learning.local:5173'
	@echo '   Traefik:  http://traefik.local'
	@echo '   MailHog:  http://mail.local'
	@echo '   pgAdmin:  http://db.local'
	@echo '$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)'

# =====================================================
# Production Commands
# =====================================================
prod-build: ## Build production images
	@echo '$(BLUE)🏗️  Building production images...$(NC)'
	docker-compose build --no-cache

prod-up: ## Start production environment
	@echo '$(BLUE)🚀 Starting production environment...$(NC)'
	docker-compose up -d
	@echo '$(GREEN)✅ Production environment started!$(NC)'
	@echo ''
	@echo '🌐 App: https://aru-learning.alfredoptarigan.tech'

prod-down: ## Stop production environment
	@echo '$(YELLOW)🛑 Stopping production environment...$(NC)'
	docker-compose down

prod-restart: ## Restart production environment
	@make prod-down
	@make prod-up

prod-logs: ## Show production logs (follow)
	docker-compose logs -f

# =====================================================
# Database Commands
# =====================================================
db-migrate: ## Run database migrations
	@echo '$(BLUE)📊 Running migrations...$(NC)'
	docker-compose exec app php artisan migrate

db-seed: ## Run database seeders
	@echo '$(BLUE)🌱 Running seeders...$(NC)'
	docker-compose exec app php artisan db:seed

db-fresh: ## Fresh migration with seed
	@echo '$(YELLOW)⚠️  This will delete all data!$(NC)'
	@read -p "Continue? [y/N] " -n 1 -r; \
	echo ""; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose exec app php artisan migrate:fresh --seed; \
	fi

db-backup: ## Backup database
	@echo '$(BLUE)💾 Creating database backup...$(NC)'
	docker-compose exec postgres pg_dump -U laravel aru_learning > backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo '$(GREEN)✅ Backup created!$(NC)'

# =====================================================
# Cache Commands
# =====================================================
cache-clear: ## Clear all caches
	@echo '$(BLUE)🧹 Clearing caches...$(NC)'
	docker-compose exec app php artisan cache:clear
	docker-compose exec app php artisan config:clear
	docker-compose exec app php artisan route:clear
	docker-compose exec app php artisan view:clear
	@echo '$(GREEN)✅ Caches cleared!$(NC)'

optimize: ## Optimize application (production)
	@echo '$(BLUE)⚡ Optimizing application...$(NC)'
	docker-compose exec app php artisan config:cache
	docker-compose exec app php artisan route:cache
	docker-compose exec app php artisan view:cache
	docker-compose exec app php artisan event:cache
	@echo '$(GREEN)✅ Optimization complete!$(NC)'

# =====================================================
# Access Commands
# =====================================================
shell: ## Access app container shell
	docker-compose exec app sh

shell-root: ## Access app container shell as root
	docker-compose exec -u root app sh

tinker: ## Laravel tinker
	docker-compose exec app php artisan tinker

logs-app: ## Show app logs
	docker-compose logs -f app

logs-queue: ## Show queue worker logs
	docker-compose logs -f queue

# =====================================================
# Testing Commands
# =====================================================
test: ## Run tests
	docker-compose exec app php artisan test

test-coverage: ## Run tests with coverage
	docker-compose exec app php artisan test --coverage

# =====================================================
# Cleanup Commands
# =====================================================
clean: ## Remove all containers and volumes
	@echo '$(YELLOW)⚠️  This will remove all containers and volumes!$(NC)'
	@read -p "Continue? [y/N] " -n 1 -r; \
	echo ""; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v; \
		echo '$(GREEN)✅ Cleanup complete!$(NC)'; \
	fi

prune: ## Prune Docker system
	@echo '$(YELLOW)🧹 Pruning Docker system...$(NC)'
	docker system prune -af --volumes
	@echo '$(GREEN)✅ Prune complete!$(NC)'
