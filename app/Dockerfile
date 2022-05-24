FROM cypress/browsers:node16.14.2-slim-chrome100-ff99-edge

WORKDIR /usr/src/app

COPY ./app/package.json ./app/yarn.lock ./

RUN yarn install

CMD [ "yarn", "dev" ]
