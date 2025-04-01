const Cart = require('../models/Cart')
const Product = require("../models/Product");

require('dotenv').config();

// Get all carts (admin use case)
const getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate("userID cart_products.productID");
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Get cart by user ID
const getCartById = async (req, res) => {
    try {
        const userID = req.user.userID;
        console.log(userID)
        if (userID.toString() !== req.params.id) {
            return res.status(403).json({ message: "Access denied. You can't access this cart." });
        }          

        const cart = await Cart.findOne({ userID: userID }).populate("cart_products.productID");
        if (!cart) {
            return res.status(404).json({ message: "Your cart is empty!" });
        }
        res.status(200).json({cart});
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Get specific product from cart
const getProductFromCart = async (req, res) => {
    try {
        console.log("User:", req.user);
        const userID = req.user.userID;
        console.log("User ID:", userID);

        const { productId } = req.params.productId;  
        console.log("Product ID from params:", productId);

        
        const cart = await Cart.findOne({ userID: userID }).populate("cart_products.productID");
        // console.log("Cart found:", cart);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        if(cart.products.length === 0){
            return res.status(200).json({ cartID: null, cart_products: [],message:'Your Cart Is Empty..!' }); 
        }

        const product = cart.cart_products.find(p => p.productID.toString() === productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

//get product from cart
const getCartProducts = async (req, res) => {
    try {
      const userID = req.user.userID;
      const cart = await Cart.findOne({ userID: userID }).populate("cart_products.productID")
      .populate("cart_products.productID.discountID") ;
      if (!cart || !cart.cart_products || cart.cart_products.length === 0) {
        return res.status(404).json({ message: "Your cart is empty!", products: [] });
      }
      res.status(200).json({ products: cart.cart_products, cartID: cart._id });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  };

const insertProductInCart = async (req, res) => {
    try {
        const cartLimit = parseInt(process.env.CART_LIMIT) || 10;

        const userID = req.user.userID;
        let { productID, quantity } = req.body;
        console.log("Received productID:", productID, "quantity:", quantity);
        console.log(productID) 
        quantity = Number(quantity) || 1; // ensure a default quantity
        if (!productID || quantity <= 0) {
            return res.status(400).json({ message: "Invalid product or quantity." });
        }

        let cart = await Cart.findOne({ userID: userID });
        if (!cart) {
            cart = new Cart({ userID: userID, cart_products: [] });
        }
        
        const existingProduct = cart.cart_products.find(item => item.productID.toString() === productID);

        const totalQuantity = cart.cart_products.reduce((acc, item) => acc + item.quantity, 0);

        if (existingProduct) {
            if (totalQuantity + quantity > cartLimit) {
                return res.status(400).json({ message: `Exceeds cart limit of ${cartLimit} items.` });
            }
            existingProduct.quantity += quantity;
        } else {
            if (totalQuantity + quantity > cartLimit) {
                return res.status(400).json({ message: `Exceeds cart limit of ${cartLimit} items.` });
            }
            cart.cart_products.push({ productID, quantity });
        }

        await cart.save();
        res.status(200).json({ message: "Product added to cart successfully", cart });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


// Update product quantity in cart
const updateCartProduct = async (req, res) => {
    try {
        const cartLimit = parseInt(process.env.CART_LIMIT); 
        const userID = req.user.userID; 
        const { productID, quantity } = req.body; 

        let cart = await Cart.findOne({ userID: userID });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const existingProduct = cart.cart_products.find(item => item.productID.toString() === productID);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        const totalQuantity = cart.cart_products.reduce((acc, item) => acc + item.quantity, 0);

        const newTotalQuantity = totalQuantity - existingProduct.quantity + quantity;
        if (newTotalQuantity > cartLimit) {
            return res.status(400).json({ message: `Updating this product exceeds the cart limit of ${cartLimit} items.` });
        }

        existingProduct.quantity = quantity;

        await cart.save();
        res.status(200).json({ message: "Product quantity updated successfully", cart });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Delete product from cart
const deleteProductFromCart = async (req, res) => {
    try {
      const userID = req.user.userID;
      const productID = req.params.productID; 
      console.log("User ID:", userID);
      console.log("Product ID:", productID);
      
      const cart = await Cart.findOne({ userID: userID });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      
      if (!cart.cart_products || !Array.isArray(cart.cart_products)) {
        return res.status(404).json({ message: "No products found in cart" });
      }
      
      const productExists = cart.cart_products.some(
        (p) => p.productID && p.productID.toString() === productID
      );
      if (!productExists) {
        return res.status(404).json({ message: "Product not found in cart" });
      }
      
      cart.cart_products = cart.cart_products.filter(
        (p) => p.productID && p.productID.toString() !== productID
      );
      await cart.save();
      res.status(200).json({ message: "Product removed from cart", cart });
    } catch (error) {
      console.error("Error in deleteProductFromCart:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  
// Clear entire cart
const clearCart = async (req, res) => {
    try {
        const userID = req.user.userID;

        const cart = await Cart.findOne({ userID: userID });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.cart_products = [];
        await cart.save();

        res.status(200).json({ message: "Cart cleared successfully", cart });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

module.exports = { getAllCarts, getCartById, getProductFromCart,getCartProducts, insertProductInCart, updateCartProduct, deleteProductFromCart, clearCart };
