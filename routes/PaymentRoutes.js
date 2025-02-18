const express = require("express");
const {authenticate,authorize} = require('../middleware/AuthenticationMiddleware');
const { createRazorpayOrder, verifyRazorpayPayment, createCODPayment } = require('../controllers/PaymentController');
const router = express.Router();

// //Create Razorpay Order
// router.post("/razorpay", authenticate, createRazorpayOrder);

// //Verify Razorpay Payment
// router.post("/verify-razorpay", authenticate, verifyRazorpayPayment);

//Create COD Payment
router.post("/cod", authenticate, createCODPayment);

module.exports = router;