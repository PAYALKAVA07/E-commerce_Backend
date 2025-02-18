const mongoose = require("mongoose")

const paymentSchema = mongoose.Schema({
    // userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // orderID: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    payment_method: String,
    payment_status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    payment_amount: Number,
    payment_date: { type: Date, default: Date.now },


    transaction_id: { type: String, default: null },  // Store Transaction ID for COD or Razorpay
    razorpay_payment_id: { type: String, default: null },  // Razorpay Payment ID (for Razorpay)
    razorpay_order_id: { type: String, default: null },  // Razorpay Order ID (for Razorpay)
    razorpay_signature: { type: String, default: null },  // Razorpay Signature (for Razorpay)
    payer_contact: { type: String, default: null },  // Store payer contact number (optional)
    payment_mode: { type: String, default: null },// Mode of payment for Razorpay, e.g., UPI, Card
})

module.exports = mongoose.model('Payment', paymentSchema)