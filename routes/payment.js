const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/payment");
const authn = require("../middleware/authn");

router.post("/top-up/update-balance", PaymentController.updateBalance)
router.use(authn)
router.post("/top-up", PaymentController.topUpBalance);
router.post("/:OrderId", PaymentController.doPayment);

module.exports = router;
