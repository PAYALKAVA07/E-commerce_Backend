const express = require("express");
const { getAllProduct, getProductById, insertProduct, updateProduct, deleteProduct, } = require('../controllers/ProductController');
const {authenticate,authorize} = require('../middleware/AuthenticationMiddleware');

const router = express.Router();

//getall
router.get('/', authenticate,authorize("getAllProduct"),getAllProduct);

//getById
router.get('/:productID', authenticate,authorize("getProductById"),getProductById);

//insertProduct
router.post("/", authenticate,authorize("insertProduct"),insertProduct);

//updateProduct
router.patch('/:id', authenticate,authorize("updateProduct"),updateProduct);

//DeleteProduct
router.delete('/:id',authenticate,authorize("deleteProduct"),deleteProduct);

module.exports = router;