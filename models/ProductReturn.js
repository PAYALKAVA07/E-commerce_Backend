const mongoose = require("mongoose")

const productReturnSchema = mongoose.Schema({
    orderID: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    return_reason: String,
    return_status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    return_amount: Number,
    return_requestDate: Date,
    product_UpdateDate: Date
})

module.exports = mongoose.model('ProductReturn', productReturnSchema)