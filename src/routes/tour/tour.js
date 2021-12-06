const router = require('express').Router();
const Tour = require('../../controllers/tourController');
const { protect } = require('../../middleware/protect');
const reviewRouter = require('../reviews/reviews');
const { resizeTourImages } = require('../../utils/sharp');
const { uploadTourImages } = require('../../utils/multer');
const cleanCache = require('../../middleware/cleanCache');

/** PARAM MIDDLEWARE */
/** ------------------------------- */

router.route('/tours')
    .post(protect, Tour.createTour)
    .get(protect, Tour.getTours)

router.route('/tours/:tour_id')
    .get(protect, Tour.getTour)
    .patch(protect, uploadTourImages, resizeTourImages, Tour.updateTour)
    .delete(Tour.deleteTour)

router.get('/tour-stats', Tour.getTourStats);
router.get('/monthly-stats/:year', Tour.getMonthlyPlan);

/** MERGE ROUTES - Tour routes +  Review routes */
router.use('/tours/:tour_id/reviews', reviewRouter);

/** Geospatial Queries Routes */
router.route('/tours/tours-within/:distance/center/:latlng/unit/:unit')
    .get(Tour.getTourWithin)

router.route('/tours/distances/:latlng/unit/:unit')
    .get(Tour.getDistances)

module.exports = router;