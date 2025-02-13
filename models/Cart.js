const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({
    cart_products: [{
        productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number
    }],
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

module.exports = mongoose.model('Cart',cartSchema)