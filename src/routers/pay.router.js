const express = require("express");
const router = express.Router();
const payController = require("../controllers/pay.controller");

/*   /create/orderId [get]   */
router.get("/create/orderId", payController.payViewController);

/*    /create/orderId   */
router.post("/create/orderId", payController.payUserController);

module.exports = router;
