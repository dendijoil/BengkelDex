const express = require("express");
const router = express.Router();
const workshops = require("./workshops");
const customers = require("./customers");

router.use("/workshops", workshops);
router.use("/customers", customers);

module.exports = router;
