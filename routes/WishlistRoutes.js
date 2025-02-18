const express = require('express');
const { authenticate, authorize } = require('../middleware/AuthenticationMiddleware');
const { getAllWishlist, getWishlistById, getProductFromWishlist, changeStatus } = require('../controllers/WishlistController');
const router = express.Router();

//get all wishlist
router.get('/', authenticate, authorize('getAllWishlist'),getAllWishlist)

//get product from user's wishlist
router.get('/products', authenticate, authorize('getProductFromWishlist'), getProductFromWishlist)

//get wishlist by id
router.get('/:id', authenticate,authorize('getWishlistById'), getWishlistById)

//add remove product to wishlist
router.post('/', authenticate, authorize('changeStatus'), changeStatus)

module.exports = router;