module.exports = (sequelize, DataTypes) => (
    sequelize.define('detail', {
        num: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        timestamps: true,
        paranoid: true
    })
);