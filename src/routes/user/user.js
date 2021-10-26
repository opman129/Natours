const router = require('express').Router();
const { getUsers, getUser, updateUser, deleteMe, deleteUser } = require('../../controllers/userController');
const { protect } = require('../../middleware/protect');
const { checkIfUserIsAdmin } = require('../../middleware/validator');

router.get('/users', getUsers);

router.route('/users/:user_id')
    .get(getUser)

router.patch('/updateMe', protect, updateUser);

router.delete('/deleteMe', protect, deleteMe);

/** Using the Delete Helper Function for this route */
router.delete('/users/:id', protect, checkIfUserIsAdmin, deleteUser);

module.exports = router;