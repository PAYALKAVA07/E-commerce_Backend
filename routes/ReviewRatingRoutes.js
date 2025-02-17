const express = require('express');
const { authenticate, authorize } = require('../middleware/AuthenticationMiddleware');
const {allReviewRating,Product_ReviewRating,getReviewRatingById,insertReviewRating,updateReviewRating,deleteReviewRating} = require('../controllers/ReviewRatingController');
const router = express.Router();

//GET all ReviewRating
router.get('/', authenticate, authorize("allReviewRating"), allReviewRating)

//GET All ReviewRating of particular product by id
router.get('/product/:productId', authenticate, authorize("Product_ReviewRating"), Product_ReviewRating)

//GET ReviewRating by id
router.get('/:id', authenticate, authorize("getReviewRatingById"), getReviewRatingById);

//insert ReviewRating
router.post('/product/:productId', authenticate, authorize("insertReviewRating"), insertReviewRating);

//update ReviewRating
router.patch('/:id', authenticate, authorize("updateReviewRating"), updateReviewRating);

//delete ReviewRating
router.delete('/:id', authenticate, authorize("deleteReviewRating"), deleteReviewRating);

module.exports = router;