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

  Admin.prototype.setPassword = async function (password) {
    const hash = await bcrypt.hash(password, 12);
    this.hashedPassword = hash;
  };
  Admin.prototype.checkPassword = async function (password) {
    const result = await bcrypt.compare(password, this.hashedPassword);
    return result;
  };
  Admin.prototype.serialize = function () {
    const data = { id: this.id, nick: this.nick };

    return data;
  };
  Admin.findByEmail = function (email) {
    return this.findOne({ where: { email } });
  };
  Admin.findByNick = function (nick) {
    return this.findOne({ where: { nick } });
  };

  return Admin;
};
