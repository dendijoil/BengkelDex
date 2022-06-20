"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      WorkshopId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Workshops",
          key: "id",
        },
      },
      date: {
        type: Sequelize.DATE,
      },
      paymentStatus: {
        type: Sequelize.BOOLEAN,
      },
      totalPrice: {
        type: Sequelize.INTEGER,
      },
      paymentType: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders");
  },
};
