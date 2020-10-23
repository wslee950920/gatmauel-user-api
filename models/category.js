module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "category",
    {
      category: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      }
    },
    {
      timestamps: false,
    }
  );