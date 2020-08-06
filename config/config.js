require("dotenv").config();

module.exports = {
  development: {
    username: process.env.SEQUELIZE_USERNAME,
    password: process.env.SEQUELIZE_PASSWORD,
    database: "gatmauel",
    host: "gatmauelDB",
    dialect: "mysql",
  },
  production: {
    username: process.env.SEQUELIZE_USERNAME,
    password: process.env.SEQUELIZE_PASSWORD,
    database: "gatmauelDB",
    host: "gatmauel",
    dialect: "mysql",
    logging: false,
  },
};
