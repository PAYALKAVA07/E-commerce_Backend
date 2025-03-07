const Order = require("../models/Order");
const ReturnProduct = require("../models/ProductReturn");

const getAllReturnProduct = async (req, res) => {
    try {
        const returnProduct = await ReturnProduct.find().populate("orderID");
        if (!returnProduct.length) {
            return res.status(404).json({ message: "No return requests available!" });
        }
        res.status(200).json(returnProduct);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getReturnById = async (req, res) => {
    try {
        const user_id = req.user.userID;
        const returnRequest = await ReturnProduct.findById(req.params.id).populate("orderID");

        if (!returnRequest) {
            return res.status(404).json({ message: "Return request not found." });
        }

        if (returnRequest.userID.toString() !== user_id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. You can't access this return request." });
        }

        res.status(200).json(returnRequest);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getUserReturns = async (req, res) => {
    try {
        const user_id = req.user.userID;
        const role = req.user.role;

        let returnRequests;
        if (role === "admin") {
            returnRequests = await ReturnProduct.find().populate("orderID");
        } else {
            returnRequests = await ReturnProduct.find({ userID: user_id }).populate("orderID");
        }

        if (!returnRequests.length) {
            return res.status(404).json({ message: "No return requests found." });
        }

        res.status(200).json(returnRequests);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const createReturnRequest = async (req, res) => {
    try {
        const { orderID, return_reason } = req.body;
        const user_id = req.user.userID;

        const order = await Order.findById(orderID);
        if (!order || order.is_deleted) {
            return res.status(404).json({ message: "Order not found." });
        }

        if (order.userID.toString() !== user_id) {
            return res.status(403).json({ message: "You are not authorized to return this order." });
        }

        const deliveryDate = order.updated_at;
        const currentDate = new Date();
        const timeDifference = (currentDate - deliveryDate) / (1000 * 60 * 60 * 24);

        if (timeDifference > 7) {
            return res.status(400).json({ message: "Return period expired. Returns are only allowed within 7 days of delivery." });
        }

        const existingReturn = await ReturnProduct.findOne({ orderID });
        if (existingReturn) {
            return res.status(400).json({ message: "Return request already exists for this order." });
        }

        const newReturn = new ReturnProduct({
            orderID,
            userID: user_id,
            return_reason,
            return_status: "pending"
        });

        await newReturn.save();
        res.status(201).json({ message: "Return request submitted successfully.", returnRequest: newReturn });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const updateReturnRequest = async (req, res) => {
    try {
        const { return_id } = req.params;
        const { return_status } = req.body;

        const returnRequest = await ReturnProduct.findById(return_id);
        if (!returnRequest) {
            return res.status(404).json({ message: "Return request not found." });
        }

        returnRequest.return_status = return_status;
        returnRequest.product_UpdateDate = new Date();
        await returnRequest.save();

        res.status(200).json({ message: "Return request updated successfully.", returnRequest });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { createReturnRequest, getUserReturns, getReturnById, updateReturnRequest, getAllReturnProduct };
