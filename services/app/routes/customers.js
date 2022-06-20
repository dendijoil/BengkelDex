const express = require("express");
const CustomerController = require("../controllers/customers.js");
const router = express.Router();
const authn = require("../middleware/authn");

router.post("/register", CustomerController.register);
router.post("/login", CustomerController.loginCustomer);
router.use(authn);
router.patch("/broadcast", CustomerController.updateBroadcast);
router.get("/near-workshops", CustomerController.findWorkshopByRadius);
module.exports = router;
