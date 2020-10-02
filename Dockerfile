FROM node:14

WORKDIR /gatmauel/user-api

COPY . .

EXPOSE 9090

CMD npm start
