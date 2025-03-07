const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const roles = require('../config/roles');

const authenticate = (req, res, next) => {
    console.log("Headers:", req.headers);

    const token = req.headers["value"];
    console.log("Token:", token);

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No token provided." });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); 
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ message: "Invalid Token", error });
    }
};

const authorize = (action) => (req, res, next) => {
    console.log("User role:", req.user ? req.user.role : "No user role found");
    
    if (!req.user || !req.user.role) {
        return res.status(403).json({ message: "Access Denied: No user role detected." });
    }

    const userRole = req.user.role;

    if (!roles[userRole] || !roles[userRole].includes(action)) {
        return res.status(403).json({ message: `Access Denied: ${userRole} cannot perform ${action}` });
    }
    next();
};

module.exports = { authenticate, authorize };
