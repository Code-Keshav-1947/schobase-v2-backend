const AppError = require('./AppError');
const BadRequestError = require('./BadRequestError');
const ConflictError = require('./ConflictError');
const ForbiddenError = require('./ForbiddenError');
const NotFoundError = require('./NotFoundError');
const UnauthorizedError = require('./UnauthorizedError');

module.exports = {
    AppError,
    BadRequestError,
    ConflictError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
};
