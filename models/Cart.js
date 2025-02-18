const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({
    cart_products: [{
        productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number
    }],
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cart_productlimit: { type: Number, require: true },
    cart_created_at: { type: Date, default: Date.now },
    cart_updated_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Cart', cartSchema)