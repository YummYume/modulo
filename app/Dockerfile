FROM node:16.3.0-alpine

WORKDIR /usr/src/app

COPY ./app/package.json ./app/yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD [ "yarn", "dev" ]
