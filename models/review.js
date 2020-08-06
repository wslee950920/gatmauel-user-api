module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "review",
    {
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
