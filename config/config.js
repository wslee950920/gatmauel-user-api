require("dotenv").config();

module.exports = {
  development: {
    username: process.env.SEQUELIZE_DEV_USERNAME,
    password: process.env.SEQUELIZE_DEV_PASSWORD,
    database: "gatmauel_develop",
    host: "devGatmauelDB",
    dialect: "mysql",
    timezone: "+09:00", // 타임존을 설정
  },
  production: {
    username: process.env.SEQUELIZE_PROD_USERNAME,
    password: process.env.SEQUELIZE_PROD_PASSWORD,
    database: "gatmauel_deploy",
    host: process.env.SEQUELIZE_PROD_HOST,
    dialect: "mysql",
    logging: false,
    timezone: "+09:00", // 타임존을 설정
  },
};
