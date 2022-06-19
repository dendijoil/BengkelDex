"use strict";
const { User } = require("../models/index");
const { hashPassword, comparePassword, generateToken } = require("../helpers");
class CostumerController {
  static async register(req, res) {
    try {
      let role = "costumer";
      let statusBroadcast = false;
      let balance = 0;
      let userLocation = {
        type: "Point",
        coordinates: [0, 0],
      };
      const { name, username, email, password, address } = req.body;
      console.log(name, username, email, password, address);
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

  static async loginCustumer(req, res) {
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
}

module.exports = CostumerController;
