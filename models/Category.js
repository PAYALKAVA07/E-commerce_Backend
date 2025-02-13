const mongoose = require("mongoose")

const categorySchema = mongoose.Schema({
    category_name: String,
    category_description: String,
    category_images: [],
    category_created_at: { type: Date, default: Date.now },
    category_updated_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Category',categorySchema)