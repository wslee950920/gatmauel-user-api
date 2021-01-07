module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "food",
    {
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      img: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      compo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      prior: {
        type: DataTypes.INTEGER,
      },
      deli: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      timestamps: false,
    }
  );
