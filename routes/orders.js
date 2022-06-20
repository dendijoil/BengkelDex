const express = require("express");
const router = express.Router();
const authn = require("../middleware/authn");
const OrderController = require("../controllers/orders");

router.use(authn);
router.get("/", OrderController.getAllOrders);
router.post("/:WorkshopId", OrderController.createOrder);
router.get("/:OrderId", OrderController.getOrderDetailsById);

module.exports = router;
