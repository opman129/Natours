const router = require('express').Router();
const auth = require('./user/auth');
const tour = require('./tour/tour');
const user = require('./user/user');
const review = require('./reviews/reviews');
const bookings = require('./bookings/bookings');
const base = require('./frontend/base');
const AppError = require('../utils/AppError');

/** -------- Server Side Rendering Routes ---------- */
router.use('/', base);

/** -------- API Routes ----------- */
router.use('/v1', auth);
router.use('/v1', tour);
router.use('/v1', user);
router.use('/v1', review);
router.use('/v1', bookings);

/** -------- Base API Route ----------- */
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to Natours, A world of awesomeness'
    });
});

router.all('*', (req, res, next) => {
    // const err = new Error(`${req.originalUrl} was not found on this platform`);
    // err.statusCode = err.statusCode || 404;
    // err.status = 'Fail'

    next(new AppError(`${req.originalUrl} was not found on this platform`, 404));
});

module.exports = router;