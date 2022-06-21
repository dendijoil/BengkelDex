"use strict";
const { hashPassword } = require("../helpers/index.js");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Workshop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Workshop.hasMany(models.Service, {
        foreignKey: "WorkshopId",
      });
    }
  }
  Workshop.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Name is required",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Email is required",
          },
          isEmail: {
            msg: "Email is invalid",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Password is required",
          },
        },
      },
      imgUrl: DataTypes.STRING,
      statusOpen: DataTypes.BOOLEAN,
      phoneNumber: DataTypes.STRING,
      address: DataTypes.STRING,
      location: DataTypes.GEOMETRY,
      balance: DataTypes.INTEGER,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Workshop",
    }
  );

  Workshop.beforeCreate((workshop, options) => {
    workshop.password = hashPassword(workshop.password);
    return workshop;
  });
  return Workshop;
};
