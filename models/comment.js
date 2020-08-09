module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "comment",
    {
      nick: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
