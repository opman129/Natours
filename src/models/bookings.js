const mongoose = require('mongoose');

const bookingsSchema = mongoose.Schema({
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to a tour'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to a user'],
    },
    price: {
        type: Number,
        required: [true, 'Booking must have a price'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    paid: {
        type: Boolean,
        default: true
    }
});

/** Populate tour and user automatically */
bookingsSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'tour',
        select: 'title'
    })
    .populate({
        path: 'user',
        select: 'name email'
    });

    next();
});

const Booking = mongoose.model('Booking', bookingsSchema)
module.exports = Booking;