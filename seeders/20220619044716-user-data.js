"use strict";

const { hashPassword } = require("../helpers/index");

module.exports = {
  async up(queryInterface, Sequelize) {
    const Users = require("../data/customers.json");
    Users.forEach((el) => {
      delete el.id;
      el.password = hashPassword(el.password);
      el.location = Sequelize.fn("ST_GeomFromText", `POINT(${el.location[0]} ${el.location[1]})`);
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Users", Users, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  },
};
