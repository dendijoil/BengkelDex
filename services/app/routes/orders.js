const express = require("express");
const router = express.Router();
const authn = require("../middleware/authn");
const OrderController = require("../controllers/orders")

router.use(authn);
router.get("/");
router.post("/:WorkshopId", OrderController.createOrder);
router.get("/:OrderId");

module.exports = router;