module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "order",
    {
      customer: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(11),
        allowNull: false,
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      paid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      request: {
        type: DataTypes.TEXT,
      },
      deli: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
