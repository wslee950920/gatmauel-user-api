dockerize -wait tcp://{aws_rds_public_address}:3306 -timeout 30s
./node_modules/.bin/sequelize db:create
npm run start:server
