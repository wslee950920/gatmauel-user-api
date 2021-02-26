module.exports = (sequelize, DataTypes) =>
  sequelize.define("hashtag", {
    title: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
    chartset: "utf8mb4", // mb4 => 이모티콘 허용하기 위해
      collate: "utf8mb4_general_ci",
  }
);
