const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const roles = require('../config/roles');

const authenticate = (req,res,next) =>{
    console.log(req.headers);

    const token = req.headers["value"];
    console.log("Token:",token)

    if(!token){
        return res.send({message :"Access Denided No token Provided..!"})
    }
    try {
        const decoded = jwt.verify(token.split(" ")[1],process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } 
    catch (error) {
        res.send(error);
    }
}

const authorize = (action) => (req, res, next) => {

    const userRole = req.user.role;
    if(!roles[userRole] || !roles[userRole].includes(action)) {
        return res.status(403).json({ message: "Access Denied for authorize" });
    }
    next();
}

module.exports = {authenticate,authorize};
