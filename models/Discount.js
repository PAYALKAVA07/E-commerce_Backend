const mongoose = require("mongoose")

const discountSchema = mongoose.Schema({
    discout_type: { type: String, required: true },
    discount_value: { type: Number, require: true },
    discount_startDate: Date,
    discount_endDate: Date
})

module.exports = mongoose.model('Discount', discountSchema)