const express = require("express");
const router = express.Router();
const workshops = require("./workshops");
const costumers = require("./custumers");

router.use("/workshops", workshops);
router.use("/customers", costumers);

module.exports = router;
