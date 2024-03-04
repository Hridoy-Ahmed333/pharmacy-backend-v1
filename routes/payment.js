const express = require("express");
const paymentController = require("../controller/payment");
const paymentRouter = express.Router();
paymentRouter.post("/", paymentController.payment);
exports.paymentRouter = paymentRouter;
