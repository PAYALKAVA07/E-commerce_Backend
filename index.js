const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();
const authRoutes = require('./routes/AuthRoutes');
const userRoute = require('./routes/UserRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');
const discountRoutes = require('./routes/DiscountRoutes');
const productRoutes = require('./routes/ProductRoutes');
const couponRoutes = require('./routes/CouponRoutes');
const ReviewRatingRoutes = require('./routes/ReviewRatingRoutes');
const cartRoutes = require('./routes/CartRoutes');
const orderRoutes = require('./routes/OrderRoutes');
const paymentRoutes = require('./routes/PaymentRoutes');
const wishlistRoutes = require('./routes/WishlistRoutes');
const ProductReturnRoutes = require('./routes/ProductReturnRoutes');

mongoose.connect(process.env.atlasUrl).then(() => {
    console.log('Connected to MongoDB Server');

    const app = express();
    app.use(cors()); 
    
    app.use(express.json());  
    app.use(express.urlencoded({ extended: true }));

    app.use('/auth', authRoutes);
    app.use('/users', userRoute);
    app.use('/category', categoryRoutes);
    app.use('/discount', discountRoutes);
    app.use('/products', productRoutes);
    app.use('/coupon',couponRoutes);
    app.use('/reviewrating',ReviewRatingRoutes);
    app.use('/cart', cartRoutes);
    app.use('/order',orderRoutes);
    app.use('/payment',paymentRoutes);
    app.use('/wishlist',wishlistRoutes);
    app.use('/productreturn',ProductReturnRoutes);

    app.listen(process.env.PORT, () => {
        console.log('Server Started @', process.env.PORT);
    });
});