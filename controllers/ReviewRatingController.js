const ReviewRating = require('../models/ReviewRating');

//getAll ReviewRating
const allReviewRating = async (req, res) => {
    try {
        const ReviewRatings = await ReviewRating.find();
        res.send(ReviewRatings);
    }
    catch (error) {
        res.send(error);
    }
}

//get ReviewRating by product
const Product_ReviewRating = async (req, res) => {
    try {
        const ReviewRatings = await ReviewRating.findById(req.params.productID);
        if (!ReviewRating.length) {
            return res.send({ message: "There Is No Review & Rating are Available For this Product..!" });
        }
        res.send(ReviewRatings);
    }
    catch (error) {
        res.send(error);
    }
}

//get ReviewRating by Id
const getReviewRatingById = async (req, res) => {
    try {
        const ReviewRating = await ReviewRating.findById(req.params.id).populate('userID user_name').populate('productID product_name');
        if (!ReviewRating) {
            return res.send({ message: "Rebiew & Rating Not Found..!" });
        }
        res.send(ReviewRating);
    }
    catch (error) {
        res.send(error);
    }
}

//insert ReviewRating
const insertReviewRating = async (req, res) => {
    try {
        // const { productId } = req.params;
        const { rating, comment } = req.body;
        const userID = req.user.user_id;

        // Validate input fields
        if (!userID || !rating) return res.send({ message: 'User ID and rating are required' });
        if (rating < 1 || rating > 5) return res.send({ message: 'Rating must be between 1 and 5' });
        t
        const [userExists, productExists] = await Promise.all([
            User.findById(userID),
            Product.findById(req.params.id)
        ]);

        if (!userExists) return res.send({ message: 'User Not Found..!' });
        if (!productExists) return res.send({ message: 'Product Not Found..!' });
        const ReviewRating = new ReviewRating({ user_id: userID, product_id: req.params.id, review, rating, review_date: Date.now() });
        await ReviewRating.save();

        res.send({ message: 'ReviewRating submitted successfully', ReviewRating });
    } catch (error) {
        res.send(error);
    }
}

//update ReviewRating
const updateReviewRating = async (req, res) => {
    try {
        const userID = req.user.user_id;
        if (!userID) return res.status(401).json({ message: "Unauthorized.." });

        const ReviewRating = await ReviewRating.findById(req.params.id);
        if (!ReviewRating) return res.status(404).json({ message: "ReviewRating Not Found..!" });

        if (ReviewRating.user_id.toString() !== userID && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. You can't update this ReviewRating." });
        }
        const { rating, review } = req.body;
        if (rating === undefined && !comment) return res.send({ message: "Please provide rating or comment to update." });

        const updateData = {
            rating: rating ?? ReviewRating.rating,
            review: review ?? ReviewRating.review,
            review_date: Date.now()
        };

        const updatedReviewRating = await ReviewRating.findByIdAndUpdate(req.params.id, updateData, { new: true });
        
        res.send({ message: "ReviewRating updated successfully", ReviewRating: updatedReviewRating });

    } catch (error) {
        res.send(error);
    }
};

//delete ReviewRating
const deleteReviewRating = async (req, res) => {
    try {
        const userID = req.user.user_id;

        const ReviewRating = await ReviewRating.findById(req.params.id);

        if (!ReviewRating || ReviewRating.user_id.toString() !== userID) {
            return res.send({
                message: ReviewRating ? "Access denied. You can't delete this ReviewRating." : "ReviewRating not found"
            });
        }

        await ReviewRating.deleteOne();
        res.status(200).json({ message: 'ReviewRating deleted successfully..!' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = {allReviewRating,Product_ReviewRating,getReviewRatingById,insertReviewRating,updateReviewRating,deleteReviewRating};