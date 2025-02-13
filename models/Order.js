const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    couponID: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon'},
    order_products: [{ 
        productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, 
        quantity: Number 
    }],
    order_totalAmount: Number,
    order_shippingAddress: String,
    order_created_at: {type: Date, default:Date.now},
    order_updated_at: {type: Date, default:Date.now},
    order_status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' }
})

module.exports = mongoose.model('Order',orderSchema)