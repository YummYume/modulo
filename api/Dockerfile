FROM php:8.1-fpm-alpine

WORKDIR /app/api

RUN docker-php-ext-install pdo pdo_mysql && \
	docker-php-ext-enable pdo pdo_mysql

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# This hopefully fixes the "cannot delete directory : directory not empty" error when running clear:cache, although it might not be related to permissions at all
RUN mkdir -p var/cache/prod var/cache/dev var/cache/test var/log \
   && chown -R www-data:www-data var/ \
   && chmod -R ug+rwX var/
