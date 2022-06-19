const express = require("express");
const CustomerController = require("../controllers/costumers.js");
const router = express.Router();

router.post("/register", CustomerController.register);
router.post("/login", CustomerController.loginCustumer);
module.exports = router;
