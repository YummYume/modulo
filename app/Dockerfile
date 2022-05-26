FROM cypress/browsers:node16.14.2-slim-chrome100-ff99-edge

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    x11vnc \
    fluxbox \
    supervisor

COPY ./app/package.json ./app/yarn.lock ./
COPY ./app/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN yarn install

CMD ["/usr/bin/supervisord"]
