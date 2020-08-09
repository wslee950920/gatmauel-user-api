const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      email: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
      },
      nick: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      hashedPassword: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(11),
        allowNull: true,
        unique: true,
      },
      provider: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "local",
      },
      snsId: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );

  User.prototype.setPassword = async function (password) {
    const hash = await bcrypt.hash(password, 12);
    this.hashedPassword = hash;
  };
  User.prototype.checkPassword = async function (password) {
    const result = await bcrypt.compare(password, this.hashedPassword);
    return result;
  };
  User.prototype.serialize = function () {
    const data = { id: this.id, nick: this.nick };
    return data;
  };
  User.prototype.generateToken = function () {
    const token = jwt.sign(
      {
        id: this.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    return token;
  };
  User.findByEmail = function (email) {
    return this.findOne({ where: { email } });
  };
  User.findByNick = function (nick) {
    return this.findOne({ where: { nick } });
  };
  User.findBySns = function (profileId, provider) {
    return this.findOne({ where: { snsId: profileId, provider } });
  };

  return User;
};
