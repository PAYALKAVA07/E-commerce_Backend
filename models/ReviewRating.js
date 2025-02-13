const mongoose = require("mongoose")

const reviewRatingSchema = mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    review: String,
    rating: Number,
    review_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('ReviewRating', reviewRatingSchema)