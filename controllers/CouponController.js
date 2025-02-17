const Coupon = require("../models/Coupon");
const Order = require("../models/Order");

const getAllCoupon = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        if (!coupons || coupons.length === 0) {
            return res.send({ message: "No coupons found" });
        }
        res.send(coupons);
    } catch (error) {
        res.send({ message: "Error fetching coupons", error });
    }
};

const insertCoupon = async (req, res) => {
    try {
        const { coupon_code, coupon_DiscountType, coupon_value, coupon_startDate, coupon_expirationDate, coupon_limit } = req.body;

        if (!coupon_code || !coupon_DiscountType || !coupon_value || !coupon_startDate || !coupon_expirationDate || !coupon_limit) {
            return res.send({ message: "All fields are required" });
        }

        const validTypes = ["percentage", "flat"];
        if (!validTypes.includes(coupon_DiscountType)) {
            return res.send({ message: "Invalid discount type. Use 'percentage' or 'flat'." });
        }

        if (coupon_value <= 0) {
            return res.send({ message: "Discount value must be greater than zero." });
        }

        if (new Date(coupon_startDate) >= new Date(coupon_expirationDate)) {
            return res.send({ message: "Start date must be before expiration date" });
        }

        const existingCoupon = await Coupon.findOne({ coupon_code });
        if (existingCoupon) {
            return res.send({ message: "Coupon code already exists" });
        }

        const newCoupon = new Coupon({
            coupon_code,
            coupon_DiscountType,
            coupon_value,
            coupon_startDate,
            coupon_expirationDate,
            coupon_limit
        });

        await newCoupon.save();
        res.send({ message: "Coupon created successfully", coupon: newCoupon });
    } catch (error) {
        res.send({ message: "Error creating coupon", error });
    }
};

const updateCoupon = async (req, res) => {
    try {
        const updates = req.body;
        const couponId = req.params.id;

        const existingCoupon = await Coupon.findById(couponId);
        if (!existingCoupon) {
            return res.send({ message: "Coupon not found" });
        }

        if (updates.coupon_code && updates.coupon_code !== existingCoupon.coupon_code) {
            const existingCode = await Coupon.findOne({ coupon_code: updates.coupon_code });
            if (existingCode) {
                return res.send({ message: "Coupon code already exists. Choose a unique one." });
            }
        }

        if (updates.coupon_DiscountType) {
            const validTypes = ["percentage", "flat"];
            if (!validTypes.includes(updates.coupon_DiscountType)) {
                return res.send({ message: "Invalid coupon type. Use 'percentage' or 'flat'." });
            }
        }

        if (updates.coupon_value !== undefined && updates.coupon_value <= 0) {
            return res.send({ message: "Coupon value must be greater than zero." });
        }

        const startDate = updates.coupon_startDate ? new Date(updates.coupon_startDate) : existingCoupon.coupon_startDate;
        const endDate = updates.coupon_expirationDate ? new Date(updates.coupon_expirationDate) : existingCoupon.coupon_expirationDate;

        if (startDate >= endDate) {
            return res.send({ message: "End date must be greater than start date." });
        }

        const usedCount = await Order.countDocuments({ coupon_id: couponId });
        if (updates.coupon_limit !== undefined && updates.coupon_limit < usedCount) {
            return res.send({ message: `Usage limit cannot be less than "${usedCount}" (already used).` });
        }

        const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, updates, { new: true });
        res.send({ message: "Coupon updated successfully", coupon: updatedCoupon });
    } catch (error) {
        res.send({ message: "Error updating coupon", error });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const couponId = req.params.id;

        const existingCoupon = await Coupon.findByIdAndDelete(couponId);
        if (!existingCoupon) {
            return res.send({ message: "Coupon not found" });
        }

        res.send({ message: "Coupon deleted successfully" });
    } catch (error) {
        res.send({ message: "Error deleting coupon", error });
    }
};

module.exports = { getAllCoupon, insertCoupon, updateCoupon, deleteCoupon };
