const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const roles = require('../config/roles');

const authenticate = (req,res,next) =>{
    console.log(req.headers);

    const token = req.headers["authorization"];

    if(!token || !token.startsWith("Bearer ")){
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

const authorize = (role,action)=>{
    if(!roles[role] || !roles[role].includes(action)){
        return res.send({message:"Access Denied for Authorize..!"});
    }
    next();
}
module.exports = {authenticate,authorize};
