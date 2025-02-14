const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { } = require('../models/User');

//registeration for new User
const register_User = async (req, res) => {
    try {
        const { user_name, user_contact, user_email, user_password, user_confirmpassword, user_address, user_DOB, user_role } = req.body;

        if (!user_email || !user_password || !user_confirmpassword) {
            return res.send({ message: "Email & password are required..!" })
        }
        if (user_password !== user_confirmpassword) {
            return res.send({ message: "Password doesn't Match..!" })
        }
        const existingUser = await User.findOne({ user_email: req.body.user_email });
        if (existingUser) {
            return res.send({ message: "This User already exists..!" });
        }

        const hashedPassword = await bcrypt.hash(user_password, 10);
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
        res.send({ message: "New User Created..!", user: newUser });
    }
    catch (error) {
        res.send(error);
    }
}

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