const Cart = require("../models/Cart");
const Coupon = require("../models/Coupon");
const Order = require("../models/Order");
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

const getAllOrderOfUser = async (req,res) => {
    try {
        const userID = req.user.userID;
        const orders = await Order.find({userID:req.params.userID}).populate("order_products.productID couponID paymentID");

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found for this user" });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { userID, order_shippingAddress, cartID, couponID } = req.body;

        // Find the cart and populate the products
        const cart = await Cart.findById(cartID).populate('cart_products.productID');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Calculate total amount
        let totalAmount = 0;
        cart.cart_products.forEach(item => {
            totalAmount += item.productID.product_price * item.quantity;
        });

        // Initialize discount
        let discount = 0;

        // Apply coupon if provided
        if (couponID) {
            const coupon = await Coupon.findById(couponID);
            if (!coupon) {
                return res.status(404).json({ message: 'Coupon not found' });
            }

            // Check if coupon is expired
            const currentDate = new Date();
            if (currentDate > coupon.coupon_expirationDate) {
                return res.status(400).json({ message: 'Coupon has expired' });
            }

            // Check if coupon limit has been reached
            if (coupon.coupon_limit <= 0) {
                return res.status(400).json({ message: 'Coupon limit has been reached' });
            }

            // Calculate discount based on coupon type
            if (coupon.coupon_DiscountType === 'percentage') {
                discount = (totalAmount * coupon.coupon_value) / 100; // Apply percentage discount
            } else if (coupon.coupon_DiscountType === 'fixed') {
                discount = coupon.coupon_value; // Apply fixed discount
            }

            // Decrease coupon limit (you may want to implement a more robust usage tracking)
            coupon.coupon_limit -= 1;
            await coupon.save();
        }

        // Apply discount to total amount
        totalAmount -= discount;

        // Create the order
        const newOrder = new Order({
            userID,
            order_shippingAddress,
            order_totalAmount: totalAmount,
            order_products: cart.cart_products,
            couponID
        });

        await newOrder.save();

        // Optionally, clear the cart after order creation
        // await Cart.findByIdAndDelete(cartID);

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

module.exports = { createOrder, getAllOrder, getOrderById, updateOrderStatus, getAllOrderOfUser }