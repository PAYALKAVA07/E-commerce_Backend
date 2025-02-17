const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/User');

//registeration for new User
const register_User = async (req, res) => {
    try {
        console.log("Received Request Body:", req.body); // Debugging step

        const { user_name, user_contact, user_email, user_password, user_confirmpassword, user_address, user_DOB, user_role } = req.body;
        
        if (!user_email || !user_password || !user_confirmpassword) {
            return res.status(400).json({ message: "Email & password are required..!" });
        }
        if (user_password !== user_confirmpassword) {
            return res.status(400).json({ message: "Password doesn't match!" });
        }

        // Debug: Check if user exists
        const existingUser = await User.findOne({ user_email });
        console.log("Existing User:", existingUser);

        if (existingUser) {
            return res.status(409).json({ message: "This user already exists!" });
        }

        const hashedPassword = await bcrypt.hash(user_password, 10);
        console.log("Hashed Password:", hashedPassword);

        const newUser = new User({
            user_name,
            user_contact,
            user_email,
            user_password: hashedPassword,
            user_address,
            user_DOB,
            user_role,
        });

        await newUser.save();
        console.log("New User Created:", newUser);

        res.status(201).json({ message: "User registered successfully!", user: newUser });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


//login for existing user
const login_User = async (req, res) => {
    try {
        const { user_email, user_password } = req.body;

        const user = await User.findOne({ user_email });
        if (!user) {
            return res.send({ isValid: false, message: "Invalid Username or Password..!" });
        }

        const isMatch = await bcrypt.compare(user_password, user.user_password);
        if (!isMatch) {
            return res.send({ isValid: false, message: "Invalid Username or Password..!" });
        }

        const token = jwt.sign({ userID: user._id, role: user.user_role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.send({ isValid: true, message: "Welcome", token });
    }
    catch (error) {
        res.send(error);
    }
}

module.exports = {register_User,login_User};