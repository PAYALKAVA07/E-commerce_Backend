const mongoose = require("mongoose")

const categorySchema = mongoose.Schema({
    category_name: { type: String, required: true },
    category_description: String,
    category_image: String,
    category_created_at: { type: Date, default: Date.now },
    category_updated_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Category', categorySchema)