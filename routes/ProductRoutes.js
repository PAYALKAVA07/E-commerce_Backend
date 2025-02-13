const express = require("express");
const Product = require('../models/Product');
const router = express.Router();

//getall
router.get('/', async (req, res) => {
  const data = await Product.find().populate('categoryID discountID');
  res.send(data);
});

//getById
router.get('/:id', async (req, res) => {
  try {
    const data = await Product.findById(req.params.id).populate('categoryID discountID');
    if (!data) {
      return res.send({ message: "Product not found" });
    }
    res.send(data);
  }
  catch (error) {
    res.send(error);
  }
});

//insertProduct
router.post("/", async (req, res) => {
  try {
    const existingProduct = await Product.findOne({ product_name: req.body.product_name });
    if (existingProduct) {
      return res.send({ message: "This Product already exists" });
    }
    const data = await Product.create(req.body);
    res.send({message:"Data Inserted Successfully",data:data});
  }
  catch (error) {
    res.send(error);
  }
});

//updateProduct
router.patch('/:id', async (req, res) => {
  try {
    const data = await Product.findByIdAndUpdate(req.params.id, req.body);
    if (!data) {
      return res.send({ message: "Product not found" });
    }
    res.send(data);
  }
  catch (error) {
    res.send(error);
  }
});

//DeleteProduct
router.delete('/:id', async (req, res) => {
  try {
    const data = await Product.findByIdAndDelete(req.params.id)
    if (!data) {
      return res.send({ message: "Product not found" });
    }
    res.send(data);
  }
  catch (error) {
    res.send(error);
  }
});

module.exports = router;