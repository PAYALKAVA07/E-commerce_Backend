const express = require("express");
const { getAllCategories, getCategoryById, createCategory, deleteCategory, updateCategory }= require('../controllers/CategoryController');
const AuthenticationMiddleware = require('../middleware/AuthenticationMiddleware');

const router = express.Router();

//getAll
router.get('/',  AuthenticationMiddleware.authenticate, getAllCategories);
//getById
router.get('/:id', AuthenticationMiddleware.authenticate, getCategoryById);
//createCategory
router.post('/', AuthenticationMiddleware.authenticate, AuthenticationMiddleware.authorize("admin", "createCategory"), createCategory);
//deleteCategory
router.delete('/:id', AuthenticationMiddleware.authenticate, AuthenticationMiddleware.authorize("admin", "deleteCategory"), deleteCategory);
//updateCategory
router.patch('/:id', AuthenticationMiddleware.authenticate, AuthenticationMiddleware.authorize("admin", "updateCategory"), updateCategory);

module.exports = router;


// //getall
// router.get('/', async (req, res) => {
//   const data = await Category.find();
//   res.send(data);
// });

// //getById
// router.get('/:id', async (req, res) => {
//   try {
//     const data = await Category.findById(req.params.id);
//     if (!data) {
//       return res.send({ message: "Category not found" });
//     }
//     res.send(data);
//   }
//   catch (error) {
//     res.send(error);
//   }
// });

// //insertCategory
// router.post("/", async (req, res) => {
//   try {
//     const existingCategory = await Category.findOne({ category_name: req.body.category_name });
//     if (existingCategory) {
//       return res.send({ message: "This Category already exists" });
//     }
//     const data = await Category.create(req.body);
//     res.send(data);
//   }
//   catch (error) {
//     res.send(error);
//   }
// });

// //updateCategory
// router.patch('/:id', async (req, res) => {
//   try {
//     const data = await Category.findByIdAndUpdate(req.params.id, req.body);
//     if (!data) {
//       return res.send({ message: "Category not found" });
//     }
//     res.send(data);
//   }
//   catch (error) {
//     res.send(error);
//   }
// });

// //DeleteCategory
// router.delete('/:id',async(req,res)=>{
//   try {
//     const data = await Category.findByIdAndDelete(req.params.id)
//     if (!data) {
//       return res.send({ message: "Category not found" });
//     }
//     res.send(data);
//   } 
//   catch (error) {
//     res.send(error);
//   }
// })