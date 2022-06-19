const express = require("express");
const WorkshopController = require("../controllers/workshops");
const router = express.Router();

router.post("/register", WorkshopController.registerWorkshop);
router.post("/login", WorkshopController.loginWorkshop);
router.post("/services/:WorkshopId");
router.get("/services/:WorkshopId", WorkshopController.getWorkshopServices);
router.patch("/:workshopId", WorkshopController.updateStatus);

module.exports = router;
