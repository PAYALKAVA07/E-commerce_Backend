const roles = {
    admin: ['getAllUsers', 'getUserById', 'updateUser', 'deleteUser', 'getAllCategories', 'getCategoryById', 'createCategory', 'updateCategory', 'deleteCategory'],
    customer: ['viewProducts', 'buyProduct']
};

module.exports = roles;