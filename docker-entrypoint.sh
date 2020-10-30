dockerize -wait tcp://devGatmauelDB:3306 -timeout 30s
./node_modules/.bin/sequelize db:create
npm run start
