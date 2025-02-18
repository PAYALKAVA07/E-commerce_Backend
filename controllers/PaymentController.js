const Payment = require('../models/Payment');
const Order = require('../models/Order');

const createCODPayment = async (req, res) => {
    try {
        const { orderID } = req.body;

        // Fetch the order
        const order = await Order.findById(orderID);
        if (!order) {
            return res.status(404).json({ message: "Order not found!" });
        }

        // Create payment details for COD
        const payment = new Payment({
            payment_method: "COD",
            amount: order.total_amount,
            payment_status: "pending",  // COD payment is always pending until delivery
        });

        await payment.save();

        // Link payment_id to the order
        order.paymentID = payment._id;
        await order.save();

        res.status(200).json({
            message: "COD payment successfull..!",
            paymentID: payment._id,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = {createCODPayment}