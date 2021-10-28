const router = require('express').Router();
const auth = require('./user/auth');
const tour = require('./tour/tour');
const user = require('./user/user');
const review = require('./reviews/reviews');
const base = require('./frontend/base');

/** -------- Server Side Rendering Routes ---------- */
router.use('/', base);

/** -------- API Routes ----------- */
router.use('/v1', auth);
router.use('/v1', tour);
router.use('/v1', user);
router.use('/v1', review);

/** -------- Base API Route ----------- */
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to Natours, A world of awesomeness'
    });
});

router.all('*', (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `${req.originalUrl} was not found on this platform`
    });
});

module.exports = router;