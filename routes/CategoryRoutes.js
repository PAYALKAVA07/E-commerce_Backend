const express = require("express");
const { getAllCategories, getCategoryById, createCategory, deleteCategory, updateCategory }= require('../controllers/CategoryController');
const {authenticate,authorize} = require('../middleware/AuthenticationMiddleware');

const router = express.Router();

//get All Category
router.get("/", authenticate, authorize("getAllCategories"), getAllCategories);

//get Category by id
router.get("/:id", authenticate, authorize("getCategoryById"), getCategoryById);

//create Category
router.post("/", authenticate, authorize("createCategory"), createCategory);

//update Category
router.patch("/:id", authenticate, authorize("updateCategory"), updateCategory);

//delete Category
router.delete("/:id", authenticate, authorize("deleteCategory"), deleteCategory);

module.exports = router;
