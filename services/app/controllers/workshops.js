"use strict";
const { hashPassword, comparePassword, generateToken } = require("../helpers");
const { Workshop, Service, User } = require("../models");
class WorkshopController {
  static async registerWorkshop(req, res, next) {
    try {
      const { name, email, password, phoneNumber, address, longitude = 0, latitude = 0 } = req.body;
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
      next(error);
    }
  }

  static async loginWorkshop(req, res, next) {
    try {
      const { email, password } = req.body;
      const workshop = await Workshop.findOne({ where: { email } });
      if (!workshop) {
        throw { name: "UserNotFound" };
      }
      if (workshop) {
        const isPasswordCorrect = comparePassword(password, workshop.password);
        if (!isPasswordCorrect) {
          throw { name: "WrongPassword" };
        }
        if (isPasswordCorrect) {
          const token = generateToken({
            id: workshop.id,
            name: workshop.name,
            email: workshop.email,
            balance: workshop.balance,
            address: workshop.address,
            phoneNumber: workshop.phoneNumber,
            statusOpen: workshop.statusOpen,
            location: workshop.location,
            role: workshop.role,
          });

          const payload = {
            id: workshop.id,
            name: workshop.name,
            email: workshop.email,
            balance: workshop.balance,
            address: workshop.address,
            phoneNumber: workshop.phoneNumber,
            statusOpen: workshop.statusOpen,
            location: workshop.location,
            TalkJSID: `W-${workshop.id}`,
          };

          res.status(200).json({
            token,
            payload,
          });
        }
      } else {
        res.status(404).json({ message: "Workshop not found" });
      }
    } catch (error) {
      next(error);
    }
  }

  static async getWorkshopServices(req, res, next) {
    try {
      const { WorkshopId } = req.params;
      const workshop = await Workshop.findOne({ where: { WorkshopId } });
      const services = await Service.findAll({ where: { WorkshopId: workshop.id } });

      res.status(200).json(services);
    } catch (error) {
      next(error);
    }
  }

  static async postServices(req, res, next) {
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
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { workshopId } = req.params;
      const { statusOpen } = req.body;
      await Workshop.update({ statusOpen }, { where: { id: workshopId } });

      res.status(200).json({
        message: "Success updated statusOpen",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCustomersHelp(req, res, next) {
    try {
      const userHelp = await User.findAll({
        where: {
          statusBroadcast: true,
        },
      });
      res.status(200).json(userHelp);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = WorkshopController;
