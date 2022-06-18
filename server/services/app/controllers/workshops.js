"use strict";
const { hashPassword, comparePassword, generateToken } = require("../helpers");
const { Workshop, Service, sequelize } = require("../models");
class WorkshopController {
  static async registerWorkshop(req, res) {
    try {
      const { name, email, password, phoneNumber, address, longitude, latitude } = req.body;
      const workshopLocation = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
      const newWorkshop = await Workshop.create({
        name,
        email,
        password: hashPassword(password),
        phoneNumber,
        statusOpen: false,
        role: "staff",
        address,
        balance: 0,
        location: workshopLocation,
      });
      res.status(201).json({
        name: newWorkshop.name,
        email: newWorkshop.email,
        balance: newWorkshop.balance,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async loginWorkshop(req, res) {
    try {
      const { email, password } = req.body;
      const workshop = await Workshop.findOne({ where: { email } });

      if (workshop) {
        const isPasswordCorrect = comparePassword(password, workshop.password);
        if (isPasswordCorrect) {
          const token = generateToken({
            id: workshop.id,
            email: workshop.email,
            role: workshop.role,
          });
          res.status(200).json({
            token,
          });
        } else {
          res.status(401).json({ message: "Invalid username/password" });
        }
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getWorkshopServices(req, res) {
    try {
      const { WorkshopId } = req.params;
      const workshop = await Workshop.findOne({ where: { WorkshopId } });
      const services = await Service.findAll({ where: { WorkshopId: workshop.id } });

      res.status(200).json(services);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async postServices(req, res) {
    try {
      const { WorkshopId } = req.params;
      const { name, description, price, isPromo } = req.body;

      const newService = await Service.create({
        WorkshopId,
        name,
        description,
        price,
        isPromo,
      });

      res.status(201).json({
        name: newService.name,
        description: newService.description,
        price: newService.price,
        isPromo: newService.isPromo,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async updateStatus(req, res) {
    try {
      const { workshopId } = req.params;
      const { statusOpen } = req.body;
      const updatedWorkshop = await Workshop.update({ statusOpen }, { where: { workshopId } });

      res.status(200).json(updatedWorkshop);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async findWorkshopByRadius(req, res) {
    try {
      // Distance unit in metres
      const distance = req.query.distance || 20000;
      const long = req.query.long || -6.25881;
      const lat = req.query.lat || 106.82932;

      const result = await sequelize.query(
        `select
          id,
          name,
          location
        from
        "Workshops"
          where
            ST_DWithin(location,
              ST_MakePoint(:lat, :long),
              :distance,
              true) = true;`,
        {
          replacements: {
            distance: +distance,
            long: parseFloat(long),
            lat: parseFloat(lat),
          },
          logging: console.log,
          plain: false,
          raw: false,
          type: sequelize.QueryTypes.SELECT,
        }
      );

      res.status(200).json(result);
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  }
}

module.exports = WorkshopController;
