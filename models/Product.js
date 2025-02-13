const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    product_name: String,
    product_description: String,
    product_price: Number,
    product_stockQuantity: {type: Number, default:0},
    product_createdAt: Date,
    product_images: [],
    categoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    discountID: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount' },
    product_created_at: { type: Date, default: Date.now },
    product_updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);