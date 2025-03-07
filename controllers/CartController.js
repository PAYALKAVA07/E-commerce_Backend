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
        const userId = req.user.userID;
        console.log(userId)
        if (userId.toString() !== req.params.id) {
            return res.status(403).json({ message: "Access denied. You can't access this cart." });
        }

        const cart = await Cart.findOne({ userID: userId }).populate("cart_products.productID");
        if (!cart) {
            return res.status(404).json({ message: "Your cart is empty!" });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Get specific product from cart
const getProductFromCart = async (req, res) => {
    try {
        // Log the user object and productId
        console.log("User:", req.user);
        const userId = req.user.userID;
        console.log("User ID:", userId);

        const { productId } = req.params.productId;  // Get the productId from request parameters
        console.log("Product ID from params:", productId);

        // Find the cart for the user and populate necessary fields
        const cart = await Cart.findOne({ userID: userId }).populate("cart_products.productID");
        console.log("Cart found:", cart);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the product in the cart using the productId
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




// Insert product into cart
const insertProductInCart = async (req, res) => {
    try {
        const cartLimit = parseInt(process.env.CART_LIMIT);
        const userId = req.user.userID;
        const { productID, quantity } = req.body;

        let cart = await Cart.findOne({ userID: userId });

        if (!cart) {
            cart = new Cart({
                userID: userId,
                cart_products: []
            });
        }
        const existingProduct = cart.cart_products.find(item => item.productID.toString() === productID);

        if (existingProduct) {
            const newQuantity = existingProduct.quantity + quantity;

            const totalQuantity = cart.cart_products.reduce((acc, item) => acc + item.quantity, 0);
            if (totalQuantity + quantity > cartLimit) {
                return res.status(400).json({ message: `Adding this quantity exceeds the cart limit of ${cartLimit} items.` });
            }

            existingProduct.quantity = newQuantity; // Update the existing product's quantity
        } else {
            const totalQuantity = cart.cart_products.reduce((acc, item) => acc + item.quantity, 0);
            if (totalQuantity + quantity > cartLimit) {
                return res.status(400).json({ message: `Adding this product exceeds the cart limit of ${cartLimit} items.` });
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
        const userId = req.user.userID; 
        const { productID, quantity } = req.body; 

        let cart = await Cart.findOne({ userID: userId });

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
        const userId = req.user.userID;
        const productID = req.params;

        console.log('user :', userId);
        console.log('product :', productID);

        const cart = await Cart.findOne({ userID: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const productExists = cart.cart_products.some(p => p.productID.toString() === productID);

        if (!productExists) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        cart.cart_products = cart.cart_products.filter(p => p.productID.toString() !== productID);
        await cart.save();

        res.status(200).json({ message: "Product removed from cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


// Clear entire cart
const clearCart = async (req, res) => {
    try {
        const userId = req.user.userID;

        const cart = await Cart.findOne({ userID: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.cart_products = [];
        await cart.save();

        res.status(200).json({ message: "Cart cleared successfully", cart });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

module.exports = { getAllCarts, getCartById, getProductFromCart, insertProductInCart, updateCartProduct, deleteProductFromCart, clearCart };
