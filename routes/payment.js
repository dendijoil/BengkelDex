const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/payment");

router.post("/", PaymentController.doPayment);

module.exports = router;