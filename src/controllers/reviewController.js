const Review = require('../models/reviews');
const Tour = require('../models/tour');
const responseHandler = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');
const helper = require('../helper/helper');

exports.createReview = async (req, res, next) => {
    try {
        const tour = req.params.tour_id;
        const user = req.user._id;
        const { review, rating } = req.body;
        if (!user) return errorHandler(400, 'User with the given Id does not exist');
        const newReview = await Review.create({ user, tour, review, rating });
        const message = 'Review created successfully';
        return responseHandler(res, newReview, next, 201, message, 1);
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    };
};

/** Fetch All Review - Not used mostly in Production */
// exports.fetchAllReviews = async (req, res, next) => {
//     try {
//         let filter = {};
//         if (req.params.tour_id) filter = { tour: req.params.tour_id };
//         const reviews = await Review.find(filter).sort('-created_at').lean();
//         const message = "Reviews successfully retrieved";
//         return responseHandler(res, reviews, next, 200, message, reviews.length);
//     } catch (error) {
//         return res.status(400).json({ success: false, error: error.message });
//     };
// };

exports.fetchAllReviews = helper.find(Review);

exports.fetchReviewsForATour = async (req, res, next) => {
    try {
        const query = { _id: req.params.tour_id };
        const reviews = await Tour.findOne(query)
            .select("reviews -guides")
            .populate("reviews", "user review rating created_at _id -tour");

        const message = 'Tour reviews retrieved successfully';
        const record = reviews.reviews.length;
        return responseHandler(res, reviews, next, 200, message, record);
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    };
};

exports.fetchSingleReviewForATour = async (req, res, next) => {
    try {
        const { tour_id, review_id } = req.params;
        const review = await Review.findById(tour_id, review_id);
        const message = 'Review for tour successfully retrieved';
        return responseHandler(res, review, next, 200, message, 1);
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    };
};

/** Helper Function */
// exports.deleteReview = helper.deleteOne(Review);

exports.updateReview = helper.updateOne(Review);

exports.deleteTourReview = async (req, res, next) => {
    try {
        const { review_id } = req.params;
        const review = await Review.findByIdAndDelete(review_id);
        const message = 'Review deleted successfully';
        return responseHandler(res, null, next, 200, message, null);
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    };
};