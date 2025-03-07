const mongoose = require("mongoose")

const productReturnSchema = mongoose.Schema({
    orderID: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    return_reason: String,
    return_status: { type: String, enum: ['pending', 'approved', 'rejected', 'processing', 'completed'], default: 'pending' },
    return_requestDate: { type: Date, default: Date.now },
    product_UpdateDate: Date
})

module.exports = mongoose.model('ProductReturn', productReturnSchema);
