const roles = {
    admin: ['getAllUsers', 'getUserById', 'updateUser', 'deleteUser',
        'getAllCategories', 'getCategoryById', 'insertCategory', 'updateCategory', 'deleteCategory',
        'getAllDiscount', 'getDiscountById', 'insertDiscount', 'updateDiscount', 'deleteDiscount',
        'getAllProduct', 'getProductById', 'insertProduct', 'updateProduct', 'deleteProduct',
        'getAllCoupon', 'insertCoupon', 'updateCoupon', 'deleteCoupon',
        'allReviewRating', 'Product_ReviewRating', 'getReviewRatingById', 'insertReviewRating', 'updateReviewRating', 'deleteReviewRating',
        'getAllCarts', 'getCartById',
        'createOrder', 'getAllOrder', 'getOrderById', 'updateOrderStatus', 'getAllOrderOfUser',
        'getAllWishlist', 'getWishlistById', 'getProductFromWishlist'],

    customer: ['getUserById', 'updateUser', 'deleteUser', 'getAllCategories', 'getCategoryById', 'getAllProduct', 'getProductById',
        'allReviewRating', 'Product_ReviewRating', 'getReviewRatingById', 'insertReviewRating', 'updateReviewRating', 'deleteReviewRating',
        'getCartById', 'getProductFromCart', 'insertProductInCart', 'updateCartProduct', 'deleteProductFromCart', 'clearCart',   
        'createOrder','getOrderById','getAllOrderOfUser',
        'createCODPayment','getWishlistById','getProductFromWishlist','changeStatus']
};

module.exports = roles;

// { getAllWishlist, getWishlistById, getProductFromWishlist, changeStatus }
// { createOrder, getAllOrder, getOrderById, updateOrderStatus, getAllOrderOfUser }
// { getAllCarts, getCartById, getProductFromCart, insertProductInCart, updateCartProduct, deleteProductFromCart, clearCart }
// {allReviewRating,Product_ReviewRating,getReviewRatingById,insertReviewRating,updateReviewRating,deleteReviewRating}
// { getAllCoupon, insertCoupon, updateCoupon, deleteCoupon }
// { getAllDiscount, getDiscountById, insertDiscount, updateDiscount, deleteDiscount }
// { getAllProduct, getProductById, insertProduct, updateProduct, deleteProduct }
// { getAllUsers, getUserById, updateUser, deleteUser,  }

