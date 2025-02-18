const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    order_status: { type: String, default: 'pending' },
    order_shippingAddress: String,
    order_totalAmount: Number,
    order_products: [{
        productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number
    }],
    order_placed_at: { type: Date, default: Date.now },
    order_updated_at: { type: Date, default: Date.now },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    couponID: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    paymentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    isDeleted: { type: Boolean, default: false }
})

module.exports = mongoose.model('Order', orderSchema)