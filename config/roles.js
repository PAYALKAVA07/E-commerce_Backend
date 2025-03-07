const roles = {
    admin: ['getAllUsers', 'getUserById', 'updateUser', 'deleteUser',
        'getAllCategories', 'getCategoryById', 'insertCategory', 'updateCategory', 'deleteCategory',
        'getAllDiscount', 'getDiscountById', 'insertDiscount', 'updateDiscount', 'deleteDiscount',
        'getAllProduct', 'getProductById', 'insertProduct', 'updateProduct', 'deleteProduct', 'getBestSellingProducts',
        'getAllCoupon', 'insertCoupon', 'updateCoupon', 'deleteCoupon',
        'allReviewRating', 'Product_ReviewRating', 'getReviewRatingById', 'insertReviewRating', 'updateReviewRating', 'deleteReviewRating',
        'getAllCarts', 'getCartById',
        'createOrder', 'getAllOrder', 'getOrderById', 'updateOrderStatus', 'getAllOrderOfUser',
        'getAllWishlist', 'getWishlistById', 'getProductFromWishlist',
        'getUserReturns','getReturnById','getAllReturnProduct','updateReturnRequest'],

    customer: ['getUserById', 'updateUser', 'deleteUser', 'getAllCategories', 'getCategoryById', 'getAllProduct', 'getProductById',
        'allReviewRating', 'Product_ReviewRating', 'getReviewRatingById', 'insertReviewRating', 'updateReviewRating', 'deleteReviewRating',
        'getCartById', 'getProductFromCart', 'insertProductInCart', 'updateCartProduct', 'deleteProductFromCart', 'clearCart',   
        'createOrder','getOrderById','getAllOrderOfUser','getBestSellingProducts',
        'createCODPayment','getWishlistById','getProductFromWishlist','changeStatus',
        'createReturnRequest','getUserReturns','getReturnById',],
};

module.exports = roles;


// { createReturnRequest, getUserReturn,rgetAllReturnProductns, getReturnById, updateReturnRequest,  }
// { getAllWishlist, getWishlistById, getProductFromWishlist, changeStatus }
// { createOrder, getAllOrder, getOrderById, updateOrderStatus, getAllOrderOfUser }
// { getAllCarts, getCartById, getProductFromCart, insertProductInCart, updateCartProduct, deleteProductFromCart, clearCart }
// {allReviewRating,Product_ReviewRating,getReviewRatingById,insertReviewRating,updateReviewRating,deleteReviewRating}
// { getAllCoupon, insertCoupon, updateCoupon, deleteCoupon }
// { getAllDiscount, getDiscountById, insertDiscount, updateDiscount, deleteDiscount }
// { getAllProduct, getProductById, insertProduct, updateProduct, deleteProduct }
// { getAllUsers, getUserById, updateUser, deleteUser,  }
