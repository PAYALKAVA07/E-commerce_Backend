const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const bodyParser = require("body-parser");
const authRoutes = require('./routes/AuthRoutes');
const userRoute = require('./routes/UserRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');
const discountRoutes = require('./routes/DiscountRoutes');
const productRoutes = require('./routes/ProductRoutes');
const couponRoutes = require('./routes/CouponRoutes');
const ReviewRatingRoutes = require('./routes/ReviewRatingRoutes');
const cartRoutes = require('./routes/CartRoutes');

mongoose.connect(process.env.atlasUrl).then(() => {
    console.log('Connected to MongoDB Server');

    const app = express();

    // app.use(bodyParser.json());
    app.use(express.json());  
    app.use(express.urlencoded({ extended: true }));

    app.use('/auth', authRoutes);
    app.use('/users', userRoute);
    app.use('/categories', categoryRoutes);
    app.use('/discounts', discountRoutes);
    app.use('/products', productRoutes);
    app.use('/coupons',couponRoutes);
    app.use('/review-rating',ReviewRatingRoutes);
    app.use('/carts', cartRoutes);

    app.listen(process.env.PORT, () => {
        console.log('Server Started @', process.env.PORT);
    });
});