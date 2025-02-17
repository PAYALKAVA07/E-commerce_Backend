const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/UserController');
const { authenticate, authorize } = require('../middleware/AuthenticationMiddleware');

const router = express.Router();

//getAll
router.get('/', authenticate, authorize("getAllUsers"), getAllUsers);

//getById
router.get('/:id', authenticate, authorize("getUserById"), getUserById);

//UpdateUser
router.patch('/:id', authenticate, updateUser);

//DeleteUser
router.delete('/:id', authenticate, authorize("deleteUser"), deleteUser);

module.exports = router;