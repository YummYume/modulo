FROM php:8.1-fpm-alpine

WORKDIR /app/api

RUN apk add --no-cache --update \
   icu-dev \
   autoconf \
   g++ \
   imagemagick \
   imagemagick-dev \
   libtool \
   make \
   nss-tools \
   pcre-dev && \
   pecl install imagick && \
   docker-php-ext-configure intl && \
   docker-php-ext-install pdo pdo_mysql intl && \
   docker-php-ext-enable pdo pdo_mysql intl imagick

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# This hopefully fixes the "cannot delete directory : directory not empty" error when running cache:clear, although it might not be related to permissions at all
RUN mkdir -p var/cache/prod var/cache/dev var/cache/test var/log \
   && chown -R www-data:www-data var/ \
   && chmod -R ug+rwX var/

COPY ./api/package.json ./api/yarn.lock ./
COPY ./nginx/php.ini $PHP_INI_DIR/conf.d/

ADD https://github.com/dunglas/mercure/releases/download/v0.13.0/mercure_0.13.0_Linux_x86_64.tar.gz /etc/mercure/
RUN tar -xf /etc/mercure/mercure_0.13.0_Linux_x86_64.tar.gz -C /etc/mercure/
COPY ./api/Caddyfile.dev /etc/mercure/Caddyfile.dev

RUN apk update && apk add -u yarn
RUN yarn install

CMD ["sh", "-c", "MERCURE_PUBLISHER_JWT_KEY='test' MERCURE_SUBSCRIBER_JWT_KEY='test' SERVER_NAME=:4000 /etc/mercure/mercure run -config /etc/mercure/Caddyfile.dev"]
