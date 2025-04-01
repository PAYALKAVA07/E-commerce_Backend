const roles = {
    admin: ['getAllUsers', 'getUserById', 'updateUser', 'deleteUser','getUser',
        'getAllCategories', 'getCategoryById', 'insertCategory', 'updateCategory', 'deleteCategory',
        'getAllDiscount', 'getDiscountById', 'insertDiscount', 'updateDiscount', 'deleteDiscount',
        'getAllProduct', 'getProductById', 'insertProduct', 'updateProduct', 'deleteProduct', 'getBestSellingProducts',
        'getAllCoupon', 'insertCoupon', 'updateCoupon', 'deleteCoupon',
        'allReviewRating', 'Product_ReviewRating', 'getReviewRatingById', 'insertReviewRating', 'updateReviewRating', 'deleteReviewRating',
        'getAllCarts', 'getCartById',
        'createSingleOrder', 'createOrderFromCart', 'getAllOrder', 'getOrderById', 'updateOrderStatus', 'getAllOrdersOfUser',
        'getAllWishlist', 'getWishlistById', 'getProductFromWishlist',
        'getUserReturns', 'getReturnById', 'getAllReturnProduct', 'updateReturnRequest'],

    customer: ['getUserById', 'updateUser', 'deleteUser','getUser', 'getAllCategories', 'getCategoryById', 'getAllProduct', 'getProductById',
        'allReviewRating', 'Product_ReviewRating', 'getReviewRatingById', 'insertReviewRating', 'updateReviewRating', 'deleteReviewRating',
        'getCartById', 'getCartProducts', 'getProductFromCart', 'insertProductInCart', 'updateCartProduct', 'deleteProductFromCart', 'clearCart',
        'createSingleOrder', 'createOrderFromCart', 'getOrderById', 'getAllOrdersOfUser', 'getBestSellingProducts',
        'createCODPayment', 'getWishlistById', 'getProductFromWishlist', 'changeStatus',
        'createReturnRequest', 'getUserReturns', 'getReturnById',],
};

module.exports = roles;
