"use strict";
const { hashPassword, comparePassword, generateToken } = require("../helpers");
const { Workshop, Service, User, sequelize } = require("../models");
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
        password,
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
        throw { name: "WrongPassword" };
      }

      const isPasswordCorrect = comparePassword(password, workshop.password);
      if (!isPasswordCorrect) {
        throw { name: "WrongPassword" };
      }

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
        role: workshop.role,
        statusOpen: workshop.statusOpen,
        location: workshop.location,
        imgUrl: workshop.imgUrl,
        TalkJSID: `W-${workshop.id}`,
      };

      res.status(200).json({
        token,
        payload,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getWorkshopServices(req, res, next) {
    try {
      const { WorkshopId } = req.params;
      const workshop = await Workshop.findByPk(+WorkshopId);
      const services = await Service.findAll({ where: { WorkshopId: workshop.id } });

      res.status(200).json(services);
    } catch (error) {
      next(error);
    }
  }

  static async postServices(req, res, next) {
    try {
      const { WorkshopId } = req.params;
      const { name, price, isPromo = false } = req.body;

      const newService = await Service.create({
        WorkshopId,
        name,
        price,
        isPromo,
      });

      res.status(201).json({
        name: newService.name,
        price: newService.price,
        isPromo: newService.isPromo,
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { workshopId } = req.params;
      const { statusOpen } = req.body;
      await Workshop.update({ statusOpen }, { where: { id: workshopId } });

      res.status(200).json({
        message: "Success updated status",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCustomersHelp(req, res, next) {
    try {
      const distance = req.query.distance || 2000;
      const long = req.query.long || -6.25881;
      const lat = req.query.lat || 106.82932;

      const result = await sequelize.query(
        `select
          *
        from
        "Users"
          where
            ST_DWithin(location,
              ST_MakePoint(:lat, :long),
              :distance,
              true) = true
            and "statusBroadcast" = true;`,
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

      result.forEach((el) => {
        el.TalkJSID = `C-${el.id}`;
        delete el.password;
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getWorkshopDetail(req, res, next) {
    try {
      const { workshopId } = req.params;
      const workshop = await Workshop.findOne({
        attributes: { exclude: ["password"] },
        where: {
          id: workshopId,
        },
        include: [
          {
            model: Service,
            attributes: ["id", "name", "price", "isPromo"],
          },
        ],
      });
      workshop.dataValues.TalkJSID = `W-${workshop.id}`;
      res.status(200).json(workshop);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = WorkshopController;
