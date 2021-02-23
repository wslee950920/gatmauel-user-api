module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "order",
    {
      orderId:{
        type:DataTypes.STRING(10),
        allowNull:false,
        unique: true
      },
      tId:{
        type:DataTypes.STRING(20),
        unique:true
      },
      aId:{
        type:DataTypes.STRING(20),
        unique:true
      },
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
      address: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue:''
      },
      detail: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue:''
      },
      measure:{
        type:DataTypes.STRING(5),
        allowNull:false,
      }
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
