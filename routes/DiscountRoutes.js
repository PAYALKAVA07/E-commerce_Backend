const express = require("express");
const {getAllDiscount,getDiscountById,insertDiscount,updateDiscount,deleteDiscount} = require('../controllers/DiscountController');
const {authenticate,authorize} = require('../middleware/AuthenticationMiddleware');
const router = express.Router();

//getall
router.get('/',authenticate,authorize("getAllDiscount"),getAllDiscount);

//getById
router.get('/:id',authenticate,authorize("getDiscountById"),getDiscountById);

//insertDiscount
router.post('/',authenticate,authorize("insertDiscount"),insertDiscount);

//updateDiscount
router.patch('/:id',authenticate,authorize("updateDiscount"),updateDiscount);

//deleteDiscount
router.delete('/:id',authenticate,authorize("deleteDiscount"),deleteDiscount);

module.exports = router;