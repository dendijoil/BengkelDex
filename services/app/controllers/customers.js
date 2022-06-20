"use strict";
const { User } = require("../models/index");
const { hashPassword, comparePassword, generateToken } = require("../helpers");
class CustomerController {
  static async register(req, res, next) {
    try {
      let role = "customer";
      let statusBroadcast = false;
      let balance = 0;
      let userLocation = {
        type: "Point",
        coordinates: [0, 0],
      };
      const { name, username, email, password, address } = req.body;
      const user = await User.create({
        name,
        username,
        email,
        password: hashPassword(password),
        role,
        balance,
        statusBroadcast,
        address,
        location: userLocation,
      });
      res.status(201).json({
        message: "success create user",
      });
    } catch (error) {
      next(error);
    }
  }

  static async loginCustomer(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw { name: "UserNotFound" };
      }
      if (user) {
        const isPasswordCorrect = comparePassword(password, user.password);

        if (!isPasswordCorrect) {
          throw { name: "WrongPassword" };
        }

        if (isPasswordCorrect) {
          const token = generateToken({
            id: user.id,
            name: user.name,
            email: user.email,
            balance: user.balance,
            address: user.address,
            location: user.location,
            role: user.role,
          });
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            balance: user.balance,
            address: user.address,
            phoneNumber: user.phoneNumber,
            statusOpen: user.statusOpen,
            TalkJSID: `C-${user.id}`,
          };
          res.status(200).json({
            token,
            payload,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  }

  static async updateBroadcast(req, res, next) {
    try {
      const id = req.user.id;
      let status = req.body.status;
      const broadcast = await User.update(
        {
          statusBroadcast: status,
        },
        {
          where: {
            id: id,
          },
        }
      );
      res.status(201).json({
        message: "broadcast updated",
      });
    } catch (error) {
      next(error);
    }
  }

  static async findWorkshopByRadius(req, res, next) {
    try {
      const distance = req.query.distance || 2000;
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
      next(error);
    }
  }
}

module.exports = CustomerController;
