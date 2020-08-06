module.exports = (sequelize, DataTypes) => (
    sequelize.define('comment', {
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        timestamps: true,
        paranoid: true
    })
)