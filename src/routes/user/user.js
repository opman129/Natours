const router = require('express').Router();
const { getUsers, getUser, updateUser, deleteMe, deleteUser, getMe } = require('../../controllers/userController');
const { protect } = require('../../middleware/protect');
const { checkIfUserIsAdmin } = require('../../middleware/validator');
const { uploadUserProfilePhoto } = require('../../utils/multer');
const { resizeUserImage } = require('../../utils/sharp');

router.get('/users', getUsers);

router.route('/users/:user_id')
    .get(getUser);

router.get('/me', protect, getMe);

/** Use this route to update User name, email and profile photo */
router.patch('/updateMe', protect, uploadUserProfilePhoto, resizeUserImage, updateUser);

router.delete('/deleteMe', protect, deleteMe);

/** Using the Delete Helper Function for this route */
router.delete('/users/:id', protect, checkIfUserIsAdmin, deleteUser);

module.exports = router;