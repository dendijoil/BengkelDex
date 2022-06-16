const express = require("express");
const WorkshopController = require("../controllers/workshops");
const router = express.Router();

router.post("/register", WorkshopController.registerWorkshop);
router.post("/login");
router.post("/services");
router.get("/services");
router.patch("/:workshopId", WorkshopController.updateStatus);

module.exports = router;
