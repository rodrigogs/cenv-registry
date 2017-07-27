FROM node

ADD . /app

WORKDIR /app

RUN yarn install

ENTRYPOINT node ./bin/www
