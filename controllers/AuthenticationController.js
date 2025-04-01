const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/User');

//registeration for new User
const register_User = async (req, res) => {
    try {
        console.log("Received Request Body:", req.body); 
        
        const { user_firstName, user_lastName, user_email, user_contact, user_password, user_confirmpassword } = req.body;
        
        if (!user_email || !user_password || !user_confirmpassword) {
            return res.status(400).json({ message: "Email & password are required!" });
        }
        if (user_password !== user_confirmpassword) {
            return res.status(400).json({ message: "Passwords do not match!" });
        }

        const existingUser = await User.findOne({ user_email });
        if (existingUser) {
            return res.status(409).json({ message: "This user already exists!" });
        }

        const hashedPassword = await bcrypt.hash(user_password, 10);

        const newUser = new User({
            user_firstName,
            user_lastName,
            user_email,
            user_contact,
            user_password: hashedPassword,
            // user_role: "customer", 
            // user_profile: "", 
            // user_address: "", 
            // user_DOB: null
        });

        await newUser.save();
        const token = jwt.sign({ userID: newUser._id, role: newUser.user_role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        console.log("New User Created:", user_firstName + " " + user_lastName);

        res.status(201).json({ token,message: "User registered successfully!", user: newUser });
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
            return res.status(400).json({ isValid: false, message: "User Not Found..!" });
        }

        const isMatch = await bcrypt.compare(user_password, user.user_password);
        if (!isMatch) {
            return res.status(400).json({ isValid: false, message: "Invalid Username or Password..!" });
        }

        const token = jwt.sign({ userID: user._id, role: user.user_role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        res.status(200).json({ token, userID:user._id});
    }
    catch (error) {
        res.send(error);
    }
}

module.exports = {register_User,login_User};