const User = require('../models/User');
const bcrypt = require("bcrypt");

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const data = await User.find();
        res.send(data);
    } catch (error) {
        res.send(error);
    }
};

// Get User by ID
const getUserById = async (req, res) => {
    try {
        const data = await User.findById(req.params.id);
        if (!data) {
            return res.send({ message: "User not found" });
        }
        res.send(data);
    } catch (error) {
        res.send(error);
    }
};

// Update User
const updateUser = async (req, res) => {
    try {
        let updatedData = req.body;
        if (updatedData.user_password) {
            updatedData.user_password = await bcrypt.hash(updatedData.user_password, 10);
        }

        const data = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!data) {
            return res.status(404).json({ message: "User not found" });
        }
        res.send({ message: "User Updated Successfully..!", user: data });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.send({ message: "Access Denided Only Admin can Delete User..!" })
        }
        const userId = req.params.id;
        const data = await User.findByIdAndDelete(userId);
        if(!data){
            res.send({message:"User Not Found..!"})
        }
        res.send({ message: "User Deleted Successfully..!", user: data });
    } catch (error) {
        res.send(error);
    }
};

module.exports = { getAllUsers, getUserById,  updateUser, deleteUser,  };
