const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser,getUser } = require('../controllers/UserController');
const { authenticate, authorize } = require('../middleware/AuthenticationMiddleware');

const router = express.Router();

//getAll
router.get('/', authenticate, authorize("getAllUsers"), getAllUsers)

//get current User
router.get('/user', authenticate, authorize("getUser"), getUser);

//getById
router.get('/:id', authenticate, authorize("getUserById"), getUserById);

//UpdateUser
router.patch('/:id', authenticate,authorize("updateUser"), updateUser);

//DeleteUser
router.delete('/:id', authenticate, authorize("deleteUser"), deleteUser);

module.exports = router;