module.exports = (sequelize, DataTypes) => (
    sequelize.define('detail', {
        num: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        timestamps: true,
        paranoid: true,
        chartset: "utf8mb4", // mb4 => 이모티콘 허용하기 위해
        collate: "utf8mb4_general_ci",
    })
);