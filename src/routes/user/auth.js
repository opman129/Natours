const router = require('express').Router();
const User = require('../../controllers/authController');
const { protect } = require('../../middleware/protect');

router.post('/register', User.registerUser);
router.post('/login', User.loginUser);

router.post('/forgot-password', User.forgotPassword);
router.patch('/reset-password/:token', User.resetPassword);

/** Update User Password */
router.patch('/users/update-password', protect, User.updatePassword);

module.exports = router;