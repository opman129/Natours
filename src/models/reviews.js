const mongoose = require('mongoose');
const Tour = require('../models/tour');

const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty']
    },
    rating: {
        type: Number,
        min: 1.0,
        max: 5.0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'review must belong to a user']
    },
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour']
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date
    },
    id: false,
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

/** Query Middleware */
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

/** Document Middleware */
reviewSchema.pre('save', function (next) {
    now = new Date(Date.now());
    this.updated_at = now;
    if ( !this.created_at) {
        this.created_at = now;
    };
    next();
});

/** STATIC METHOD TO CALCULATE RATINGSAVERAGE */
reviewSchema.statics.calcAverageRatings = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRating,
        rating: stats[0].avgRating,
    });
};

/** Middleware for calcAverageRatings Logic */
reviewSchema.post('save', function() {
    /** this.constructor points to the current Model */
    this.constructor.calcAverageRatings(this.tour);
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;