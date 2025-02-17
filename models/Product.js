const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    product_name:  { type: String, required: true },
    product_description: String,
    product_price:  { type: Number, required: true },
    product_stockQuantity: { type: Number, default: 0 },
    product_images: [],
    categoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    discountID: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount' },
    product_created_at: { type: Date, default: Date.now },
    product_updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);