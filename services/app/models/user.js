"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.Order);
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      balance: DataTypes.INTEGER,
      statusBroadcast: DataTypes.BOOLEAN,
      address: DataTypes.STRING,
      location: DataTypes.GEOMETRY,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
