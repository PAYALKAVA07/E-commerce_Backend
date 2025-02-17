const mongoose = require("mongoose")

const discountSchema = mongoose.Schema({
    discount_type: { type: String, required: true },
    discount_value: { type: Number, require: true },
    discount_startDate: { type: Date, required: true },
    discount_endDate: { type: Date, required: true }
})

module.exports = mongoose.model('Discount', discountSchema)