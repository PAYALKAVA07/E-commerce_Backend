const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    coupon_code: { type: String, required: true, unique: true },
    coupon_DiscountType: { type: String, required: true },
    coupon_value: { type: Number, required: true },
    coupon_limit: { type: Number, required: true },
    coupon_startDate: { type: Date, required: true },
    coupon_expirationDate: { type: Date, required: true },
    // coupon_isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Coupon', couponSchema);