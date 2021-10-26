const jwt = require('jsonwebtoken');
const errorHandler = require("../utils/errorHandler");
const { promisify } = require('util');
const User = require('../models/user');

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    };
    
    if (!token) return errorHandler(401, "You are not logged in, login to gain access");
    
    try {
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const newUser = await User.findById(decoded.id);
        if (!newUser) {
            return errorHandler(401, 'The user belongong to this Id no longer exists');
        };

        req.user = newUser;
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Fail', error: error.message });
    };
};