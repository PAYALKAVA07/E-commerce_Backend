const express = require("express");
const { authenticate, authorize } = require('../middleware/AuthenticationMiddleware');
const { createSingleOrder, createOrderFromCart, getAllOrder, getOrderById, updateOrderStatus, getAllOrdersOfUser } = require('../controllers/OrderController')
const router = express.Router();

//getAll order
router.get("/", authenticate, authorize("getAllOrder"), getAllOrder);

//get orders of specific user
router.get('/user/all', authenticate, authorize("getAllOrdersOfUser"), getAllOrdersOfUser);

//get order by id
router.get("/:id", authenticate, authorize("getOrderById"), getOrderById);

//create single order
router.post('/single', authenticate, authorize("createSingleOrder"), createSingleOrder);

//create cart order
router.post('/cart', authenticate, authorize("createOrderFromCart"), createOrderFromCart);

//update order status
router.patch("/:id", authenticate, authorize("updateOrderStatus"), updateOrderStatus);


module.exports = router;