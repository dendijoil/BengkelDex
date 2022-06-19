const express = require("express");
const router = express.Router();
const authn = require("../middleware/authn");

router.use(authn)
router.get("/")
router.get("/:OrderId")