const { Error } = require('mongoose');

// This class is used to receive errors and set a status code and message
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
    }
}

module.exports = AppError;