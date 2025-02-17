const roles = {
    admin: ['getAllUsers', 'getUserById', 'updateUser', 'deleteUser', 
        'getAllCategories', 'getCategoryById', 'insertCategory', 'updateCategory', 'deleteCategory', 
        'getAllDiscount', 'getDiscountById', 'insertDiscount', 'updateDiscount', 'deleteDiscount',
        'getAllProduct', 'getProductById', 'insertProduct', 'updateProduct', 'deleteProduct',
        'getAllCoupon', 'insertCoupon', 'updateCoupon', 'deleteCoupon',
        'allReviewRating','Product_ReviewRating','getReviewRatingById','insertReviewRating','updateReviewRating','deleteReviewRating'
    ],

    customer: ['getUserById', 'updateUser', 'deleteUser', 'getAllCategories', 'getCategoryById','getAllProduct','getProductById',
        'allReviewRating','Product_ReviewRating','getReviewRatingById','insertReviewRating','updateReviewRating','deleteReviewRating'
    ]
};

module.exports = roles;

// {allReviewRating,Product_ReviewRating,getReviewRatingById,insertReviewRating,updateReviewRating,deleteReviewRating}
// { getAllCoupon, insertCoupon, updateCoupon, deleteCoupon }
// { getAllDiscount, getDiscountById, insertDiscount, updateDiscount, deleteDiscount }
// { getAllProduct, getProductById, insertProduct, updateProduct, deleteProduct }
// { getAllUsers, getUserById, updateUser, deleteUser,  }