const express = require('express');
const {register_User,login_User} = require('../controllers/AuthenticationController');

const router = express.Router();

router.post('/register', register_User);
router.post('/login', login_User);

module.exports = router;