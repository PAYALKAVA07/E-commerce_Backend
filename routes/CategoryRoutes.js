const express = require("express");
const Category = require('../models/Category');
const router = express.Router();

//getall
router.get('/', async (req, res) => {
  const data = await Category.find();
  res.send(data);
});

//getById
router.get('/:id', async (req, res) => {
  try {
    const data = await Category.findById(req.params.id);
    if (!data) {
      return res.send({ message: "Category not found" });
    }
    res.send(data);
  }
  catch (error) {
    res.send(error);
  }
});

//insertCategory
router.post("/", async (req, res) => {
  try {
    const existingCategory = await Category.findOne({ category_name: req.body.category_name });
    if (existingCategory) {
      return res.send({ message: "This Category already exists" });
    }
    const data = await Category.create(req.body);
    res.send(data);
  }
  catch (error) {
    res.send(error);
  }
});

//updateCategory
router.patch('/:id', async (req, res) => {
  try {
    const data = await Category.findByIdAndUpdate(req.params.id, req.body);
    if (!data) {
      return res.send({ message: "Category not found" });
    }
    res.send(data);
  }
  catch (error) {
    res.send(error);
  }
});

//DeleteCategory
router.delete('/:id',async(req,res)=>{
  try {
    const data = await Category.findByIdAndDelete(req.params.id)
    if (!data) {
      return res.send({ message: "Category not found" });
    }
    res.send(data);
  } 
  catch (error) {
    res.send(error);
  }
})

module.exports = router;