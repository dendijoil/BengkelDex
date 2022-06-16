"use strict";
const { hashPassword } = require("../helpers");
const { Workshop } = require("../models");
class WorkshopController {
  static async registerWorkshop(req, res) {
    try {
      const { name, email, password, phoneNumber, address, location } = req.body;

      const newWorkshop = await Workshop.create({
        name,
        email,
        password: hashPassword(password),
        phoneNumber,
        statusOpen: false,
        role: "staff",
        address,
        location,
      });

      res.status(201).json(newWorkshop);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async loginWorkshop(req, res) {}

  static async updateStatus(req, res) {
    try {
      const { workshopId } = req.params;
      const { statusOpen } = req.body;
      const updatedWorkshop = await Workshop.update(
        { statusOpen },
        { where: { workshopId } }
      );

      res.status(200).json(updatedWorkshop);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = WorkshopController;
