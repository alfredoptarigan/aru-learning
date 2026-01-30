# =====================================================
# Stage 1: Node Builder - Build Vite Assets
# =====================================================
FROM node:24-alpine AS node-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy source files
COPY . .

# Build production assets
RUN npm run build

# =====================================================
# Stage 2: Composer Dependencies
# =====================================================
FROM composer:2 AS composer-builder

WORKDIR /app

# Copy composer files
COPY composer.json composer.lock ./

# Install production dependencies
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader

# =====================================================
# Stage 3: Production Runtime
# =====================================================
FROM php:8.4-fpm-alpine AS production

LABEL maintainer="Alfredo Patricius Tarigan <alfredoptarigan@tech.com>"
LABEL description="ARU Learning - Platform Pembelajaran Online"

# Install system dependencies
RUN apk add --no-cache \
    postgresql-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    icu-dev \
    oniguruma-dev \
    bash \
    git \
    curl

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_pgsql \
        pgsql \
        bcmath \
        opcache \
        zip \
        gd \
        pcntl \
        intl \
        mbstring

# Install Redis extension via PECL
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

# Copy PHP configuration
COPY docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/php/php-fpm.conf /usr/local/etc/php-fpm.d/zz-custom.conf

# Set working directory
WORKDIR /var/www/html

# Copy application code
COPY --chown=www-data:www-data . .

# Copy built assets from node-builder
COPY --from=node-builder --chown=www-data:www-data /app/public/build ./public/build

# Copy vendor from composer-builder
COPY --from=composer-builder --chown=www-data:www-data /app/vendor ./vendor

# Set proper permissions
RUN chown -R www-data:www-data \
    /var/www/html/storage \
    /var/www/html/bootstrap/cache

# Copy startup script
COPY docker/scripts/startup.sh /usr/local/bin/startup.sh
RUN chmod +x /usr/local/bin/startup.sh

# Expose PHP-FPM port
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD php-fpm -t || exit 1

# Run startup script
CMD ["/usr/local/bin/startup.sh"]

# =====================================================
# Stage 4: Development Runtime
# =====================================================
FROM production AS development

# Install development dependencies
RUN apk add --no-cache \
    nodejs \
    npm

# Install Composer for development
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install Xdebug for debugging
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && apk del .build-deps

# Copy Xdebug configuration
COPY docker/php/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

# Don't run as www-data in development for easier file permissions
USER root

CMD ["php-fpm"]
