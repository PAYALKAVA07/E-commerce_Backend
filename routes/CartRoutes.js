const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/AuthenticationMiddleware');
const { getAllCarts, getCartById, getProductFromCart, insertProductInCart, updateCartProduct, deleteProductFromCart, clearCart } = require('../controllers/CartController');


// Get all carts (admin use case)
router.get("/", authenticate, authorize("getAllCarts"), getAllCarts);

// Get a specific product from a user's cart
router.get("/product/:productId",authenticate, authorize("getProductFromCart"), getProductFromCart);

// Get a specific user's cart by user ID
router.get("/:id", authenticate, authorize("getCartById"), getCartById);

// Insert product into a user's cart
router.post("/add", authenticate, authorize("insertProductInCart"), insertProductInCart);

// Update product quantity in user's cart
router.patch("/update", authenticate, authorize("updateCartProduct"), updateCartProduct);

// Delete a product from user's cart
router.delete("/remove/:productID", authenticate, authorize("deleteProductFromCart"), deleteProductFromCart);

// Clear entire cart for the user
router.delete("/clear", authenticate, authorize("clearCart"), clearCart);


// //GET all cart
// router.get('/', authenticate, authorize('getAllCart'), getAllCart)

// //GET product from user's cart
// router.get('/products/:id', authenticate, authorize('getProductFromCart'), getProductFromCart)

// //GET cart by id
// router.get('/:id', authenticate,authorize('getCartById'), getCartById)

// //PATCH(update) cart
// router.patch('/:id',  authenticate,authorize('updateCartProduct'), updateCartProduct)

// //DELETE product from cart
// router.delete('/:id', authenticate,authorize('deleteProductFromCart'), deleteProductFromCart)

// //POST(insert) product inside user's cart
// router.post('/', authenticate,authorize('insertProductInCart'), insertProductInCart)

module.exports = router;