const AppError = require('../utils/AppError');
const multer = require('multer');

const handleDuplicateFieldsError = (err) => {
    const value = err.message.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
    return new AppError(`${value.replace(/"/g, '')} already exists. Please use something else.`, 409);
}

const handleCastError = () => {
    return new AppError(`We are unable to find what you are looking for!`, 404);
}

const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    if (err.errors && Object.values(err.errors)[0] && Object.values(err.errors)[0].kind) {
        let value = Object.values(err.errors)[0].value instanceof Object && Object.values(err.errors)[0].value.constructor.name
        return new AppError(`Invalid input data. ${value || Object.values(err.errors)[0].value} is an invalid input type for ${Object
            .values(err.errors)[0].path}`)
    }
    return new AppError(`Invalid Input Data. ${errors.join('. ')}`, 422);
}

const handleJwtError = () => {
    return new AppError('An error occured. Please login again', 401);
}

const handleTokenExpiredError = () => {
    return new AppError('You have been logged out of the application, please login again.', 401);
}

const handleFileNotFoundError = () => {
    return new AppError('The file you intended to delete does not exist', 400);
}

const handleMulterError = (err) => {
    return new AppError(err.message, 400);
}

const handleAxiosError = (err) => {
    const message = err.response && err.response.data ? err.response.data.message : "There was an error completing this request."
    const status = err.response ? err.response.status : 400;
    return new AppError(message, status)
}


const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
};

const sendErrorInProd = (err, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        return res.status(500).json({
            status: 'error',
            message: "An error was encountered while carrying out the operation."
        });
    };
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);

    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        if (error.code === 11000 && !error.handled) error = handleDuplicateFieldsError(error);
        if (error.name === 'CastError') error = handleCastError();
        if (error.name === 'ValidationError') error = handleValidationError(error);
        if (error.name === 'JsonWebTokenError') error = handleJwtError();
        if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();
        if (error.code === 'ENOENT') error = handleFileNotFoundError();
        if (error instanceof multer.MulterError) error = handleMulterError(error);
        if (error.isAxiosError) error = handleAxiosError(error);

        sendErrorInProd(error, res);
        return; 
    };
};