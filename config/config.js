require("dotenv").config();

module.exports = {
  development: {
    username: process.env.SEQUELIZE_USERNAME,
    password: process.env.SEQUELIZE_PASSWORD,
    database: "gatmauel_test",
    host: "gatmauelDB",
    dialect: "mysql",
  },
  production: {
    username: process.env.SEQUELIZE_USERNAME,
    password: process.env.SEQUELIZE_PASSWORD,
    database: "gatmauel_deploy",
    host: "gatmauelDB",
    dialect: "mysql",
    logging: false,
  },
};
