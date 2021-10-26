const { DateTime } = require('luxon');
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please enter title of the tour'],
        unique: true,
        maxlength: [40, 'A tour title must not be greater than 40 characters'],
        minlength: [10, 'A tour title must not be lesser than 10 characters'],
    },
    duration: {
        type: Number,
        required: true,
        max: 50,
        min: 2
    },
    maxGroupSize: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        required: true,
        enum: { 
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty must be set to either easy, meduim, or difficult'
        },
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Enter a rating greater than or equal to 1'],
        max: [5, 'Enter a rating lesser than or equal to 5']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        min: 0,
        max: 5.0,
        default: 4.5,
        required: [true, 'Please enter a rating for this tour']
    },
    price: {
        type: Number,
        required: [true, 'Enter price of the tour']
    },
    discount: {
        type: Number,
        validate: {
            validator: 
                function(val) {
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) must not be greater than price ({PRICE})'  
        },
    },
    summary: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    imageCover: {
        type: String,
        required: true
    },
    images: [String],
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    slug: String,
    id: false,
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date
    },
    startLocation: {
        /** GeoJSON for Geospatial Data */
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
    },
    /** Embedded Documents */
    locations: [
        {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
    }],
    guides: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // reviews: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Review'
    // }],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

/** Virtual Properties */
tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

/** Virtual Populate */
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});

/** Document Middleware -PRE AND POST HOOKS 
 * There are 4 types of Middleware in Mongoose namely:
 * Document, Query, Aggregate and Model Middleware
*/
// PRE only runs on .save() and .create() commands

/** Document Middleware */
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.title, { lower: true })
    next();
});

/** Query Middleware */
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } })
    next();
});

/** Aggregation Middleware */
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
    next();
});

/** For Populating Fields */
tourSchema.pre(/^find/, function (next) {
    this.populate ({
        path: 'guides',
        select: '-__v -passwordChangedAt -createdAt -updatedAt'
    });
    next();
});

/** Document Middleware */
tourSchema.pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if ( !this.created_at) {
        this.created_at = now;
    };
    next();
});

const Tour = mongoose.model("Tour", tourSchema)
module.exports = Tour;