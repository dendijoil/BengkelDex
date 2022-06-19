const express = require("express");
const CustomerController = require("../controllers/costumers.js");
const router = express.Router();
const { authn } = require("../middleware/authn");

router.post("/register", CustomerController.register);
router.post("/login", CustomerController.loginCustumer);
router.use(authn);
router.patch("/broadcast", CustomerController.updateBroadcast);
router.get('/workshops', CustomerController.getWorkshops);
module.exports = router;
