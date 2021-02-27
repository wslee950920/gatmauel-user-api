FROM node:14-alpine

WORKDIR /gatmauel/user-api
COPY . .

RUN apk add --no-cache tzdata 
ENV TZ Asia/Seoul

RUN apk add --no-cache openssl
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz
    
RUN npm install

EXPOSE 9090

RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ./docker-entrypoint.sh 
