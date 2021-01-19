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
      eVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      detail: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(11),
        allowNull: true,
        unique: true,
      },
      pVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      timestamps: true,
      paranoid: true,
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
  User.prototype.generateToken = function (checked) {
    const token = jwt.sign(
      {
        id: this.id,
        nick: this.nick,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: checked?"30d":"1d",
      }
    );

    return token;
  };
  User.findByEmail = function (email, paranoid) {
    return this.findOne({ where: { email }, paranoid });
  };
  User.findByNick = function (nick, paranoid) {
    return this.findOne({ where: { nick }, paranoid });
  };
  User.findBySns = function (profileId, provider) {
    return this.findOne({ where: { snsId: profileId, provider } });
  };

  return User;
};
