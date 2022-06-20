const express = require("express");
const WorkshopController = require("../controllers/workshops");
const router = express.Router();

router.post("/register", WorkshopController.registerWorkshop);
router.post("/login", WorkshopController.loginWorkshop);
router.post("/services/:WorkshopId", WorkshopController.postServices);
router.get("/services/:WorkshopId", WorkshopController.getWorkshopServices);
router.get("/need-help", WorkshopController.getCustomersHelp);
router.get("/:workshopId", WorkshopController.getWorkshopDetail);
router.patch("/:workshopId", WorkshopController.updateStatus);

module.exports = router;
