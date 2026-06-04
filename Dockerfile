# CI/CD Trigger Test - 2026-06-04
FROM php:8.2-fpm-alpine

# Install Nginx, supervisor, and curl dependencies
RUN apk add --no-cache nginx supervisor curl curl-dev \
    && docker-php-ext-install curl

# Copy Nginx server configuration
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy supervisor configuration
COPY supervisord.conf /etc/supervisord.conf

# Copy application source code
COPY public_html /var/www/html

# Expose HTTP port
EXPOSE 80

# Start supervisord to manage processes
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
