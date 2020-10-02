module.exports = (sequelize, DataTypes) =>
  sequelize.define("hashtag", {
    title: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
  });
