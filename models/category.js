module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "category",
    {
      category: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      prior: {
        type: DataTypes.INTEGER,
      }
    },
    {
      timestamps: false,
      chartset: "utf8mb4", // mb4 => 이모티콘 허용하기 위해
      collate: "utf8mb4_general_ci",
    }
  );