const Wishlist = require("../models/Wishlist");
const User = require("../models/User");
const Product = require("../models/Product");


const getAllWishlist = async (req, res) => {
    try {
        const wishlists = await Wishlist.find().populate('userID').populate('wishlist_products.productID');
        res.status(200).json(wishlists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get wishlist by ID
const getWishlistById = async (req, res) => {
    try {
        const userID = req.user.userID;
        const wishlist = await Wishlist.findById(req.params.id).populate('userID').populate('wishlist_products.productID');
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific product from the wishlist
const getProductFromWishlist = async (req, res) => {
    try {
        const userID = req.user.userID;
        // console.log(req.user);
        const wishlist = await Wishlist.findOne({ userID: userID }).populate('wishlist_products.productID');
        // console.log(wishlist.wishlist_products)

        if (!wishlist) {
            return res.status(404).json({ message: "Your wishlist is empty!" });
        }
        res.status(200).json(wishlist);
    }
    catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const changeStatus = async (req, res) => {
    try {
        const { productID } = req.body;
        const userID = req.user.userID;
        const user = await User.findById(userID);
        console.log('REQ.USER =>', req.user);


        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }

        let wishlist = await Wishlist.findOne({ userID: userID });
        if (!wishlist) {
            wishlist = new Wishlist({ wishlist_products: [], userID: userID });
            await wishlist.save();
        }

        wishlist.wishlist_updated_at = Date.now();

        // const productIndex = wishlist.wishlist_products.findIndex(p => p.productID.toString() == productID);
        const productIndex = wishlist.wishlist_products.findIndex(p =>
            p.productID && p.productID.toString() === productID
          );
          
        if (productIndex === -1) {
            wishlist.wishlist_products.push({ productID: productID });
            await wishlist.save();
            return res.status(200).json({ success: true, message: 'Product inserted in wishlist' });
        }
        else {
            wishlist.wishlist_products.splice(productIndex, 1);
            await wishlist.save();
            return res.status(200).json({ success: false, message: 'Product removed from wishlist' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = { getAllWishlist, getWishlistById, getProductFromWishlist, changeStatus }