const { AppError } = require('../utils/errors');

module.exports = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Prisma unique constraint violation
    if (err.code === 'P2002') {
        const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : err.meta?.target || 'field';
        message = `Unique constraint failed on field(s): ${target}`;
        statusCode = 409;
    }

    // Prisma record not found
    if (err.code === 'P2025') {
        message = 'Record not found';
        statusCode = 404;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        message = 'Invalid token';
        statusCode = 401;
    }
    if (err.name === 'TokenExpiredError') {
        message = 'Token has expired';
        statusCode = 401;
    }

    if (process.env.NODE_ENV === 'development') {
        console.error('Error encountered:', err);
        return res.status(statusCode).json({
            status: 'error',
            message,
            statusCode,
            stack: err.stack,
            error: err,
        });
    }

    return res.status(statusCode).json({
        status: 'error',
        message: statusCode === 500 ? 'Internal Server Error' : message,
    });
};
