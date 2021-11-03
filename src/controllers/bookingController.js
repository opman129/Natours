const Tour = require('../models/tour');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SK);
const { catchAsync } = require("../utils/catchAsync");
const errorHandler = require('../utils/errorHandler');
const responseHandler = require('../utils/responseHandler');

exports.getCheckoutSession = async (req, res, next) => {
    try {
        /** Get Currently Booked Tour */
        const tour = await Tour.findById(req.params.tour_id);
        
        /** Create session as response - STRIPE INTEGRATION WORKs NOW*/
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}/`,
            cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
            customer_email: req.user.email,
            client_reference_id: req.params.tour_id,
            line_items: [
                {
                    name: `${tour.title} Tour`,
                    description: tour.summary,
                    amount: tour.price * 100,
                    currency: 'usd',
                    quantity: 1
                },
            ],
        });

        /** Send to client */
        const message = 'Stripe session generated successfully';
        return responseHandler(res, session, next, 201, message, 1);
    } catch (error) {
        return res.status(400).json({ message: 'Fail', error: error.message });
    };
};