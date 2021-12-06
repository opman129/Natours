const errorHandler = require("../utils/errorHandler");
const AppError = require('../utils/AppError');
const Tour = require("../models/tour");
const Review = require("../models/reviews");

exports.checkIfUserIsAdmin = (req, res, next) => {
    if (req.user && req.user.roles != "admin")
    return next(new AppError("You don't have the required permissions to perform this action", 403));
};

exports.checkIfUserIsAdminTourGuide = (req, res, next) => {
    if (req.user && req.user.roles != "guide" || req.user.roles != "admin")
    return next(new AppError("You don't have the required permissions to perform this action", 403));

};

exports.checkIfRoleIsUser = (req, res, next) => {
    if (req.user && req.user.roles !== 'user')
    return next(new AppError("You don't have the required permissions to perform this action", 403));
};

/** Check if user is review creator before deleting a review */
exports.checkIfUserIsReviewCreator = async (req, res, next) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    console.log(req.user._id, review.user._id)
    if (req.user && req.user._id !== review.user._id)
    // console.log(req.user._id)
    return next(new AppError('You are not the creator of this review', 403));
};
