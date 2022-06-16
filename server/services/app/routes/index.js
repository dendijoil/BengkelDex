const express = require("express");
const router = express.Router();
const workshops = require('./workshops');

router.use("/workshops");

module.exports = router;
