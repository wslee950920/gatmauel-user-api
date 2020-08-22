module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "review",
    {
      nick: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
