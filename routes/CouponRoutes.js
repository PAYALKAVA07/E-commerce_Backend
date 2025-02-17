const express = require("express");
const { getAllCoupon, insertCoupon, updateCoupon, deleteCoupon } = require('../controllers/CouponController');
const {authenticate,authorize} = require('../middleware/AuthenticationMiddleware');

const router = express.Router();

//getAll coupons
router.get('/', authenticate, authorize("getAllCoupon"), getAllCoupon)

//insertCoupon
router.post('/', authenticate, authorize("insertCoupon"), insertCoupon)

//updateCoupon
router.patch('/:id', authenticate, authorize("updateCoupon"), updateCoupon)

//deleteCoupon
router.delete('/:id', authenticate, authorize("deleteCoupon"), deleteCoupon)

module.exports = router;