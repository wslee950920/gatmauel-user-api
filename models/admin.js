const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "admin",
    {
      email: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
      },
      eVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      nick: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "사장님",
      },
      hashedPassword: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );

  Admin.findByNick = function (nick) {
    return this.findOne({ where: { nick } });
  };

  return Admin;
};
