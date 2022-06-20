const express = require("express");
const CustomerController = require("../controllers/customers.js");
const router = express.Router();
const authn = require("../middleware/authn");

router.post("/register", CustomerController.register);
router.post("/login", CustomerController.loginCustomer);
router.get('/near-workshop', CustomerController.findWorkshopByRadius);
router.use(authn);
router.patch("/broadcast", CustomerController.updateBroadcast);
module.exports = router;