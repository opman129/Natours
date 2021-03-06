const User = require('../models/user');
const responseHandler = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');
const ApiFeatures = require('../utils/ApiFeatures');
const helper = require('../helper/helper');
const { cache, clearHash, exec } = require('../utils/redis');

/** Function to check and update User Object in the database */
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getUsers = async (req, res, next) => {
    try {
        const features = new ApiFeatures(User.find(), req.query, cache)
            .filter()
            .sort()
            .limit()
            .paginate();

        const users = await features.query;
        const record = users.length;
        const message = "Users retrieved successfully";
        return responseHandler(res, users, next, 200, message, record);
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    };
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.user_id, cache);
        if(!user) {
            return errorHandler(404, 'User with the given ID does not exist');
        };
        const message = 'User retrieved successfully';
        return responseHandler(res, user, next, 200, message, 1);
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    };
};

// exports.deleteUser = async (req, res, next) => {
//     try {
//         const query = { _id: req.params.id };
//         const user = await User.findOneAndDelete(query);
//         if (!user) {
//             return errorHandler(404, "The user with the given Id does not exist");
//         };
//         const message = "User deleted successfully";
//         return responseHandler(res, null, next, 200, message);
//     } catch (error) {
//         return res.status(400).json({ success: false, error: error.message });
//     };
// };

/** Update Logged In User Details which include email and name
 * of the current logged-in user
 */
exports.updateUser = async (req, res, next) => {
    try {
        if (req.body.passowrd || req.body.passwordConfirm) {
            return errorHandler(400, "This route is not for password Update. Use the defined route for that purpose.")
        }
        const filteredBody = filterObj(req.body, 'name', 'email');
        if (req.file) filteredBody.photo = req.file.filename;

        const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
            new: true, runValidators: true
        });
        const message = "User updated successfully";
        return responseHandler(res, user, next, 200, message, 1);
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    };
};

exports.deleteMe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { $set: {
            active: false
        } });
        const message = 'Your account has been successfully deactivated';
        return responseHandler(res, null, next, 200, message)
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    };
};

/** Get SELF */
exports.getMe = (req, res, next) => {
    req.params.id = req.user._id;
    next();
};

/** Helper DeleteONE Function */
exports.deleteUser = helper.deleteOne(User);