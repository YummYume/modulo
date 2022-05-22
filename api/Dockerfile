FROM php:8.1-fpm-alpine

WORKDIR /app/api

RUN apk add --no-cache \
   icu-dev \
   freetype-dev \
   libjpeg-turbo-dev \
   libwebp-dev \
   libpng-dev

RUN docker-php-ext-configure intl && \
   docker-php-ext-configure gd --enable-gd --with-jpeg --with-webp --with-freetype && \
   docker-php-ext-install pdo pdo_mysql intl gd && \
   docker-php-ext-enable pdo pdo_mysql intl

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# This hopefully fixes the "cannot delete directory : directory not empty" error when running cache:clear, although it might not be related to permissions at all
RUN mkdir -p var/cache/prod var/cache/dev var/cache/test var/log \
   && chown -R www-data:www-data var/ \
   && chmod -R ug+rwX var/

COPY ./api/package.json ./api/yarn.lock ./
COPY ./nginx/php.ini $PHP_INI_DIR/conf.d/

RUN apk update && apk add -u yarn
RUN yarn install
