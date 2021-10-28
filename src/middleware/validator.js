const errorHandler = require("../utils/errorHandler");
const AppError = require('../utils/AppError');
const Tour = require("../models/tour");
const Review = require("../models/reviews");

exports.checkIfUserIsAdmin = (req, res, next) => {
    if (req.user && req.user.roles != "admin") {
        return errorHandler(403, "You are forbidden from performing this action");
    };
    return next();
};

exports.checkIfUserIsAdminTourGuide = (req, res, next) => {
    if (req.user && req.user.roles != "guide" || req.user.roles != "admin") {
        return errorHandler(403, "You are forbidden from performing this action");
    };
    return next();
};

exports.checkIfRoleIsUser = (req, res, next) => {
    if (req.user && req.user.roles !== 'user') {
        return errorHandler(403, "You are forbidden from performing this action");
    };
    return next();
};

/** Rewrite */
exports.checkIfUserIsReviewCreator = (req, res, next) => {
    if (req.user && req.user._id !== req.user._id) {
        return errorHandler(403, "You are not the creator of this review")
    };
    next();
};
