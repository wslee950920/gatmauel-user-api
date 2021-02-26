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
      imgs: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      chartset: "utf8mb4", // mb4 => 이모티콘 허용하기 위해
      collate: "utf8mb4_general_ci",
    }
  );
