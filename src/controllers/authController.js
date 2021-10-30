const User = require('../models/user');
const responseHandler = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' });
const signToken = require('../middleware/token');
const crypto = require('crypto');
const Email = require('../utils/email');

class AuthController {
    static async registerUser(req, res, next) {
        try {
            const { fullname, email, photo, password, passwordConfirm } = req.body;
            const created_at = new Date;
            const user = await User.create({
                fullname, email, photo, password, passwordConfirm, created_at });

            let url = `${req.protocol}://${req.get('host')}/me`;
            console.log(url);
            await new Email(user, url).sendWelcome();
            const message = "User created successfully";
            // const token = signToken({ id: user._id });
            return responseHandler(res, user, next, 201, message, 1);
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        };
    };

    static async loginUser(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return errorHandler(400, "Input your email and password");
            };

            const user = await User.findOne({ email }).select('+password');
            const correct = await user.correctPassword(password, user.password);
            if (!user || !correct) {
                return errorHandler(401, "Incorrect email or password")
            };

            const token = signToken({ id: user._id });
            // res.cookie('jwt', token, {
            //     expires: new Date((Date.now() + process.env.JWT_COOKEIE_EXPIRES *24*60*1000*60 ),
            //     httpOnly: true
            // })

            // console.log(res.cookie);
            const message = 'User successfully logged in';
            delete user.password;
            return res.status(200).json({
                status: 'success',
                message,
                token,
                data: user
            });
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        };
    };

    static async forgotPassword (req, res, next) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return errorHandler(404, 'User not found');
            };

            const token = user.createPasswordResetToken();
            await user.save({ validateBeforeSave: false });

            const resetURL = `${req.protocol}://${req.get('host')}/v1/reset-password/${token}`;

            const message = 'Password reset token successfully sent to your email address';
            const emailMessage = `Forgot Password? Create a new pasword an submit your request to
            : ${resetURL}. \nIf you did not request for a password reset, kindly ignore this message`;

            console.log(token);
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Your password reset token is valid for 10 mins',
                    emailMessage
                });
            } catch (error) {
                await user.save({ validateBeforeSave: false });
                return res.status(500).json({ message: 'Fail', error: error.message });
            };

            return responseHandler(res, null, next, 200, message);
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        };
    };

    /** Reset User Password */
    static async resetPassword (req, res, next) {
        try {
            const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
            const user = await User.findOne({ ResetToken: hashedToken, ResetExpires: { $gt: Date.now()}});
            if (!user) {
                return errorHandler(400, 'Token has expired or is invalid');
            };

            user.password = req.body.password;
            user.passwordConfirm = req.body.passwordConfirm;
            user.ResetToken = undefined;
            user.ResetExpires = undefined;
            await user.save();

            const message = 'User password reset successfully';
            const token = signToken({ id: user._id });
            return responseHandler(res, token, next, 200, message, 1)
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        };
    };

    /** Update Logged-In User Password */
    static async updatePassword (req, res, next) {
        try {
            /** Find User From Database - User must be logged in */
            const user = await User.findById(req.user._id).select('+password');

            /** Check If current user password is correct */
            if (!(user.correctPassword(req.body.passwordCurrent, user.password))) {
                return errorHandler(400, "Your current password is incorrect");
            };

            /** Update user password if user password is correct */
            user.password = req.body.password;
            user.passwordConfirm = req.body.passwordConfirm;
            await user.save();

            /** Log-in User and send JWT */
            const token = signToken({ id: user._id });
            const message = "User password changed successfully";
            return res.status(200).json({ status: "success", message, token, user })
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        };
    };
};

module.exports = AuthController;