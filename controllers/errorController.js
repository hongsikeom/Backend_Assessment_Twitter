const AppError = require('./../utils/appError');


// Casting error
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};


// Duplicate error
const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};


// Invalid data error
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};


// Sending error message to the client
const sendError = (err, req, res) => {
    // Operational error
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            title: 'Something went wrong!',
            message: err.message
        });
    }


    // Unknown errors
    return res.status(err.statusCode).json({
        title: 'Something went wrong!',
        message: 'Please try again later.'
    });
};


module.exports = (err, req, res, next) => {
    // Defualt error setting 
    // statusCode = 500 / message = error
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Get error properties
    let error = { ...err };
    error.message = err.message;

    // Check error 
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

    sendError(error, req, res);
};
