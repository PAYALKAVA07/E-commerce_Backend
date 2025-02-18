const express = require("express");
const {authenticate,authorize} = require('../middleware/AuthenticationMiddleware');
const { createOrder, getAllOrder, getOrderById, updateOrderStatus, getAllOrderOfUser } = require('../controllers/OrderController')
const router = express.Router();

//getAll order
router.get("/", authenticate, authorize("getAllOrder"), getAllOrder);

//get orders of specific user
router.get('/user', authenticate, authorize("getAllOrderOfUser"), getAllOrderOfUser);

//get order by id
router.get("/:id", authenticate, authorize("getOrderById"), getOrderById);

//create order
router.post('/', authenticate, authorize("createOrder"), createOrder)

//update order status
router.patch("/:id", authenticate, authorize("updateOrderStatus"), updateOrderStatus);


module.exports = router;