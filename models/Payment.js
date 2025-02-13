const mongoose = require("mongoose")

const paymentSchema = mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderID: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    payment_method: String,
    payment_status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    payment_amount: Number,
    payment_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Payment', paymentSchema)