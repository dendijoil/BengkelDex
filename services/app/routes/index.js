const express = require("express");
const router = express.Router();
const workshops = require("./workshops");
const costumers = require("./customers");
const orders = require("./orders");

router.use("/workshops", workshops);
router.use("/customers", costumers);
router.use("/orders", orders);

module.exports = router;
