const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/payment");

router.post("/:OrderId", PaymentController.doPayment);

module.exports = router;