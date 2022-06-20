"use strict";

const { hashPassword } = require("../helpers");

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const workshops = require("../data/workshops.json");
    workshops.forEach((el) => {
      delete el.id;
      el.password = hashPassword(el.password);
      el.location = Sequelize.fn("ST_GeomFromText", `POINT(${el.location[0]} ${el.location[1]})`);
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Workshops", workshops, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Workshops", null, {});
  },
};
