"use strict";
const { User } = require("../models/index");
const { hashPassword, comparePassword, generateToken } = require("../helpers");
class CustomerController {
  static async register(req, res) {
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
        name: user.name,
        email: user.email,
        balance: user.balance,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  static async loginCustomer(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (user) {
        const isPasswordCorrect = comparePassword(password, user.password);
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
        } else {
          res.status(401).json({
            message: "Password is incorrect",
          });
        }
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }

    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  static async updateBroadcast(req, res) {
    try {
        const id = req.user.id
        let status = req.body.status
        const broadcast = await User.update({
            statusBroadcast: status
        }, {
            where: {
                id: id
            }
        })
        res.status(201).json({
            message: "broadcast updated",
        })
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  static async findWorkshopByRadius(req, res) {
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
      console.log(error);
      res.status(500).json(error);
    }
  }
}

module.exports = CustomerController;
