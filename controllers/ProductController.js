const Product = require('../models/Product');
const mongoose = require('mongoose');
const ReviewRating = require('../models/ReviewRating');
const Discount = require('../models/Discount');

// Get all products
const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find().populate('categoryID discountID');

        if (!products.length) {
            return res.send({ message: "No Products Found..!" });
        }

        const productWithReviews = await ReviewRating.aggregate([
            {
                $group: {
                    _id: "$productID",
                    total_Ratings: { $sum: 1 },
                    average_Rating: { $avg: "$rating" }
                }
            }
        ]);

        const allProducts = products.map(p => {
            const discount = p.discountID;
            const currentDate = new Date();

            const iDiscountActive = discount &&
                currentDate >= discount.discount_startDate &&
                currentDate <= discount.discount_endDate;

            const finalPrice = iDiscountActive
                ? Math.max(
                    p.product_price - (
                        discount.discount_type === "percentage"
                            ? (p.product_price * discount.discount_value) / 100
                            : discount.discount_value
                    ),
                    0
                )
                : p.product_price;

            const Reviews = productWithReviews.find(review => review._id?.toString() === p._id.toString()) ?? { average_Rating: 0, total_Ratings: 0 };

            return {
                _id: p._id,
                product_name: p.product_name,
                product_images: p.product_images,
                category_name: p.categoryID?.category_name || "Unknown",
                original_price: p.product_price,
                discount_price: finalPrice,
                average_rating: Reviews.average_Rating ? Reviews.average_Rating.toFixed(1) : "0.0",
                total_ratings: Reviews.total_Ratings || 0
            };
        });

        res.send(allProducts);
    } catch (error) {
        console.error("Error fetching products:", error); // Log the error for debugging
        res.status(500).json({ message: "Internal Server Error" });
    }
};



// Get product by ID
const getProductById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.send({ message: "Invalid Product ID Format" });
        }
        const product = await Product.findById(req.params.id).populate('categoryID discountID');

        if (!product) {
            return res.send({ message: "Product Not Found..!" });
        }

        const productWithReviews = await ReviewRating.aggregate([
            { $match: { productID: new mongoose.Types.ObjectId(req.params.id) } },
            {
                $group: {
                    _id: "$productID",
                    total_Ratings: { $sum: 1 },
                    average_Rating: { $avg: "$rating" }
                }
            }
        ]);

        const discount = product.discountID;
        const currentDate = new Date();

        const iDiscountActive = discount &&
            discount.discount_startDate &&
            discount.discount_endDate &&
            currentDate >= discount.discount_startDate &&
            currentDate <= discount.discount_endDate;

        const finalPrice = iDiscountActive ?
            Math.max(product.product_price - (discount.discount_type === "percentage"
                ? (product.product_price * discount.discount_value) / 100
                : discount.discount_value), 0)
            : product.product_price;

        const reviews = productWithReviews[0] || { average_Rating: 0, total_Ratings: 0 };


        res.send({
            _id: product._id,
            product_name: product.product_name,
            product_images: product.product_images,
            category_name: product.categoryID.category_name,
            original_price: product.product_price,
            discount_price: finalPrice,
            average_rating: reviews.average_Rating?.toFixed(1) || "0.0",
            total_ratings: reviews.total_Ratings || 0
        });

    }
    catch (error) {
        res.send(error);
    }
};

// Insert new product
const insertProduct = async (req, res) => {
    try {

        const { product_name, product_description, product_price, product_stockQuantity, product_images, categoryID, discountID } = req.body;

        const existingProduct = await Product.findOne({ product_name });
        if (existingProduct) {
            return res.send({ message: `Product with same name "${product_name}" already exists..!` });
        }

        if (!product_name || !product_price || !categoryID) {
            return res.status(400).json({ message: "Product name, price, and categoryID are required!" });
        }

        // Create a new product
        const newProduct = new Product({
            product_name,
            product_description,
            product_price,
            product_stockQuantity,
            product_images,
            categoryID,
            discountID
        });

        await newProduct.save();

        // Send back the inserted product data
        res.status(201).json({
            message: "Product Inserted Successfully..!",
            product: newProduct
        });

    } catch (error) {
        res.send(error);
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        data = req.body;
        data.product_updated_at = Date.now();

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.send({ message: "Product not found..!" });
        }
        res.send({ message: "Product Updated Successfully..", updatedProduct });
    } catch (error) {
        res.send(error);
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).send({ message: "Product not found..!" });
        }
        res.send({ message: "Product Deleted Successfully", deletedProduct });
    } catch (error) {
        res.send(error);
    }
};

//best-selling product
const getBestSellingProducts = async (req, res) => {
    try {
      // Find all products, sort them in descending order by total_ratings,
      // and return only the first 10.
      const bestSellingProducts = await Product.find({})
        .sort({ total_ratings: -1 }) // descending sort on total_ratings
        .limit(10);
      res.status(200).json({message:"Best Selling Products",bestSellingProducts});
    } catch (error) {
      console.error("Error fetching best selling products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

module.exports = { getAllProduct, getProductById, insertProduct, updateProduct, deleteProduct,getBestSellingProducts };