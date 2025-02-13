const mongoose = require("mongoose")

const discountSchema = mongoose.Schema({
    discount_value: Number,
    discount_startDate: Date,
    discount_endDate: Date
})

module.exports = mongoose.model('Discount', discountSchema)