const mongoose = require("mongoose")

const orderHistorySchema = mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderID: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
})

module.exports = mongoose.model('OrderHistory',orderHistorySchema)