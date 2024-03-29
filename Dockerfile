FROM node:18.13.0-alpine

MAINTAINER Yarmaliuk Mikhail <mikhail.yarmaliuk@lomray.com>

ENV WEB_PATH=/var/www

RUN mkdir -p $WEB_PATH

WORKDIR $WEB_PATH

COPY ./lib $WEB_PATH/lib
COPY ./package.json $WEB_PATH/package.json
COPY ./package-lock.json $WEB_PATH/package-lock.json
RUN rm ./lib/package.json

RUN npm ci --production --ignore-scripts

CMD npm run start:prod
