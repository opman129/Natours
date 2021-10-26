const router = require('express').Router();
const Tour = require('../../controllers/tourController');
const { protect } = require('../../middleware/protect');
const reviewRouter = require('../reviews/reviews');

/** PARAM MIDDLEWARE */
/** ------------------------------- */

router.route('/tours')
    .post(Tour.createTour)
    .get(protect, Tour.getTours)

router.route('/tours/:tour_id')
    .get(Tour.getTour)
    .patch(Tour.updateTour)
    .delete(Tour.deleteTour)

router.get('/tour-stats', Tour.getTourStats);
router.get('/monthly-stats/:year', Tour.getMonthlyPlan);

/** MERGE ROUTES  */
router.use('/tours/:tour_id/reviews', reviewRouter);

module.exports = router;