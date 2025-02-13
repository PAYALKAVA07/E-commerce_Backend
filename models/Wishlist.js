const mongoose = require("mongoose")

const wishlistSchema = mongoose.Schema({
    wishlist_products: [{
        productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
    }],
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    wishlist_created_at: { type: Date, default: Date.now },
    wishlist_updated_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Wishlist',wishlistSchema)