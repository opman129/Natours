const router = require('express').Router();
const Booking = require('../../controllers/bookingController');
const { protect } = require('../../middleware/protect');

router.get('/checkout-session/:tour_id', protect, Booking.getCheckoutSession);

module.exports = router;