const router = require('express').Router({ mergeParams: true });
const Review = require('../../controllers/reviewController');
const { protect } = require('../../middleware/protect');
const { checkIfRoleIsUser, checkIfUserIsReviewCreator } = require('../../middleware/validator');

router.get('/reviews', protect, Review.fetchAllReviews);

/** Add `checkIfRoleIsUser` */
router.post('/tours/:tour_id/reviews', protect, Review.createReview);

router.get('/tours/:tour_id/reviews', protect, Review.fetchReviewsForATour);
router.get('/tours/:tour_id/reviews/:review_id', protect, Review.fetchSingleReviewForATour);

router.patch('/tours/:tour_id/reviews/:id', protect, checkIfUserIsReviewCreator, Review.updateReview);

/** Delete Tour Review */
router.delete('/tours/:tour_id/reviews/:review_id', protect, checkIfUserIsReviewCreator, Review.deleteTourReview);

module.exports = router;