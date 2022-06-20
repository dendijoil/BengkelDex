const express = require("express");
const router = express.Router();
const workshops = require("./workshops");
const costumers = require("./customers");
const orders = require("./orders");
const payment = require('./payment');

router.use("/workshops", workshops);
router.use("/customers", costumers);
router.use("/payment", payment)
router.use("/orders", orders);

module.exports = router;
