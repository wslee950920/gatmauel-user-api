require("dotenv").config();

module.exports = {
  development: {
    username: process.env.SEQUELIZE_DEV_USERNAME,
    password: process.env.SEQUELIZE_DEV_PASSWORD,
    database: "gatmauel_develop",
    host: "devGatmauelDB",
    dialect: "mysql",
  },
  production: {
    username: process.env.SEQUELIZE_PROD_USERNAME,
    password: process.env.SEQUELIZE_PROD_PASSWORD,
    database: "gatmauel_deploy",
    host: "gatmauelDB",
    dialect: "mysql",
    logging: false,
  },
};
