module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "comment",
    {
      nick: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "사장님",
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
