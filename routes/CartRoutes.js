const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

//get all cart
router.get('/', async (req, res) => {
  const data = await Cart.find().populate('cart_products.productID');
  res.send(data);
});

//get cart By cartId
router.get('/:cartID', async (req, res) => {
  try {
    const data = await Cart.findById(req.params.cartID).populate("cart_products.productID");
    if (!data) {
      return res.send({ message: "Cart not found..!" });
    }
    res.send(data);
  }
  catch (error) {
    res.send(error);
  }
});

//get cart By userId
router.get('/user/:userID', async (req, res) => {
  try {
    const data = await Cart.findById(req.params.userID).populate("cart_products.productID");
    if (!data) {
      return res.send({ message: "Cart not found..!" });
    }
    res.send(data);
  }
  catch (error) {
    res.send(error);
  }
});

//createCart
router.post("/create", async (req, res) => {
  try {
    const { userID } = req.body;
    if (!userID) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    let existingCart = await Cart.findOne({ userID });

    if (existingCart) {
      return res.status(200).json({ message: "This User's Cart already exists..!", cart: existingCart });
    }
    const data = await Cart.create({ userID, cart_products: [] })
    res.status(201).json({ message: "Cart created successfully..!", cart: data });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//update Cart-Product
router.patch('/update-cartproduct', async (req, res) => {
  try {
    const { userID, productID, quantity } = req.body;

    const userCart = await Cart.findOneAndUpdate(
      { userID, "cart_products.productID": productID },
      { $set: { "cart_products.$.quantity": quantity } },
      { new: true }
    );

    if (!userCart) {
      return res.send({ message: "Cart or Product not found..!" });
    }
    res.send({ message: "Cart Updated Successfully..!", data: userCart })
  }
  catch (error) {
    res.send(error);
  }
});

//Delete Cart-Product
router.delete('/remove-cartproduct', async (req, res) => {
  try {
    const { userID, productID } = req.body;
    const userCart = await Cart.findOneAndUpdate(
      { userID },
      { $pull: { cart_products: { productID }}},
      { new: true }
    );

    if (!userCart) {
      return res.send({ message: "Cart not found..!" });
    }

    res.send({ message: "Product Successfully Removed from Cart", data: userCart });
  }
  catch (error) {
    res.send(error);
  }
});

//Delete Cart 
router.delete("/:userID", async (req, res) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.userID);

    if (!cart) {
      return res.status(404).json({ message: "This User's Cart not found..!" });
    }

    res.send({ message: "Cart deleted successfully..!" });
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;