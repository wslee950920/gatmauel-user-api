module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "notice",
    {
      nick: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "사장님",
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
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
