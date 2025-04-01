const Cart = require("../models/Cart");
const Coupon = require("../models/Coupon");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const getAllOrder = async (req, res) => {
    try {
        const order = await Order.find().populate('userID order_products.productID couponID paymentID');
        if (!order) {
            res.status(404).json({ message: "Orders Not Found!" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("userID order_products.productID couponID paymentID");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// const getAllOrderOfUser = async (req,res) => {
//     try {
//         const userID = req.user.userID;
//         const orders = await Order.find({userID:userID}).populate("order_products.productID couponID paymentID");

//         if (!orders.length) {
//             return res.status(404).json({ message: "No orders found for this user" });
//         }

//         res.status(200).json(orders);
//     } catch (error) {
//         res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// }

const getAllOrdersOfUser = async (req, res) => {
    try {
        const userID = req.user.userID;  // Get userID from authenticated user

        const orders = await Order.find({ userID })  // Correct filtering
            .populate("order_products.productID couponID paymentID");

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found for this user" });
        }

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

//create a single order
const createSingleOrder = async (req, res) => {
    try {
        const { productID, quantity, order_shippingAddress, coupon_code } = req.body;
        const userID = req.user.userID;

        if (!userID || !productID || !quantity || !order_shippingAddress) {
            return res.status(400).json({ message: "User ID, Product ID, quantity, and shipping address are required" });
        }

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.user_address) {
            user.user_address = order_shippingAddress;
            await user.save();
        }

        const product = await Product.findById(productID);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.product_stockQuantity < quantity) {
            return res.status(400).json({ message: `Insufficient stock for ${product.product_name}` });
        }

        let totalAmount = product.product_price * quantity;
        let couponID = null;
        let discountValue = 0;

        if (coupon_code) {
            const coupon = await Coupon.findOne({ coupon_code: coupon_code });
            if (!coupon || coupon.coupon_limit <= 0 || new Date() > coupon.coupon_expirationDate) {
                return res.status(400).json({ message: "Invalid or expired coupon" });
            }

            if (coupon.coupon_DiscountType === "percentage") {
                discountValue = (totalAmount * coupon.coupon_value) / 100;
            } else {
                discountValue = coupon.coupon_value;
            }

            totalAmount = Math.max(totalAmount - discountValue, 0);
            coupon.coupon_limit -= 1;
            await coupon.save();
            couponID = coupon._id;
        }

        // Deduct the ordered quantity from product stock
        product.product_stockQuantity -= quantity;
        await product.save();

        // Create a new order for the single product
        const newOrder = new Order({
            userID: userID,
            order_shippingAddress: order_shippingAddress,
            order_products: [{ productID: productID, quantity }],
            order_totalAmount: totalAmount,
            order_status: "pending",
            couponID: couponID,
            paymentID: null
        });

        await newOrder.save();

        res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


//create order form cart
const createOrderFromCart = async (req, res) => {
    try {
        const { order_shippingAddress, coupon_code } = req.body;
        const userID = req.user.userID;

        if (!userID || !order_shippingAddress) {
            return res.status(400).json({ message: "User ID and shipping address are required" });
        }

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user's address if not already set
        if (!user.user_address) {
            user.user_address = order_shippingAddress;
            await user.save();
        }

        // Find cart by userID and populate cart_products with product details
        const cart = await Cart.findOne({ userID: userID }).populate('cart_products.productID');
        if (!cart || cart.cart_products.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        let totalAmount = 0;
        let orderItems = [];

        // Process each cart item
        for (const item of cart.cart_products) {
            if (!item.productID) continue;

            const product = item.productID;
            totalAmount += product.product_price * item.quantity;

            if (product.product_stockQuantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.product_name}` });
            }
            // Deduct the ordered quantity from product stock
            product.product_stockQuantity -= item.quantity;
            await product.save();

            orderItems.push({
                productID: product._id,
                quantity: item.quantity
            });
        }

        let couponID = null;
        let discountValue = 0;

        if (coupon_code) {
            const coupon = await Coupon.findOne({ coupon_code: coupon_code });
            // Check coupon validity based on limit and expiration date
            if (!coupon || coupon.coupon_limit <= 0 || new Date() > coupon.coupon_expirationDate) {
                return res.status(400).json({ message: "Invalid or expired coupon" });
            }

            if (coupon.coupon_DiscountType === "percentage") {
                discountValue = (totalAmount * coupon.coupon_value) / 100;
            } else {
                discountValue = coupon.coupon_value;
            }

            totalAmount = Math.max(totalAmount - discountValue, 0);
            // Reduce coupon limit after using it
            coupon.coupon_limit -= 1;
            await coupon.save();
            couponID = coupon._id;
        }

        // Create a new order with fields that match your Order schema
        const newOrder = new Order({
            userID: userID,
            order_shippingAddress: order_shippingAddress,
            order_products: orderItems,
            order_totalAmount: totalAmount,
            order_status: "pending",
            couponID: couponID,
            paymentID: null
        });

        await newOrder.save();

        // Empty the cart after order creation
        cart.cart_products = [];
        await cart.save();

        res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const updateOrderStatus = async (req, res) => {
    try {
        const { order_status  } = req.body;

        const validStatuses = ["pending", "shipped", "delivered", "canceled"];
        if (!validStatuses.includes(order_status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        const order = await Order.findByIdAndUpdate(req.params.id, { order_status }, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.order_updated_at = new Date();
        // await order.save();

        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { createSingleOrder,createOrderFromCart, getAllOrder, getOrderById, updateOrderStatus, getAllOrdersOfUser }