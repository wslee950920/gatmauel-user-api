module.exports = (sequelize, DataTypes) => (
    sequelize.define('food', {
        food: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        img: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        comp: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: false
    })
);