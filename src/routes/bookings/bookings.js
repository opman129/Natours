const router = require('express').Router({ mergeParams: true });
const Booking = require('../../controllers/bookingController');
const { protect } = require('../../middleware/protect');

router.get('/checkout-session/:tour_id', protect, Booking.getCheckoutSession);

module.exports = router;