dockerize -wait tcp://devGatmauelDB:3306 -timeout 20s
./node_modules/.bin/sequelize db:create
npm run start
