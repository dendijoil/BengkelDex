"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Service.belongsTo(models.Workshop, {
        foreignKey: "WorkshopId",
      });
      Service.hasOne(models.OrderDetail);
    }
  }
  Service.init(
    {
      WorkshopId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      isPromo: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Service",
    }
  );
  return Service;
};
