const roles = {
    admin: ['getAllUsers', 'getUserById','updateUser', 'deleteUser', 'getAllCategories', 'getCategoryById', 'createCategory', 'updateCategory', 'deleteCategory'],
    customer: ['updateUser','deleteUser','getAllCategories', 'getCategoryById']
};

module.exports = roles;