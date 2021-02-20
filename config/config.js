require("dotenv").config();

module.exports = {
  development: {
    username: process.env.SEQUELIZE_DEV_USERNAME,
    password: process.env.SEQUELIZE_DEV_PASSWORD,
    database: "gatmauel_develop",
    host: "devGatmauelDB",
    dialect: "mysql",
    dialectOptions: { charset: "utf8mb4", dateStrings: true, typeCast: true }, // 날짜의 경우 문자열로 타입 변경 처리
    timezone: "+09:00", // 타임존을 설정
  },
  production: {
    username: process.env.SEQUELIZE_PROD_USERNAME,
    password: process.env.SEQUELIZE_PROD_PASSWORD,
    database: "gatmauel_deploy",
    host: "gatmauelDB",
    dialect: "mysql",
    logging: false,
    dialectOptions: { charset: "utf8mb4", dateStrings: true, typeCast: true }, // 날짜의 경우 문자열로 타입 변경 처리
    timezone: "+09:00", // 타임존을 설정
  },
};
