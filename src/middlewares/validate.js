const { BadRequestError } = require('../utils/errors');

const validate = (schema) => {
    return (req, res, next) => {
        try {
            const result = schema.safeParse(req.body);
            if (!result.success) {
                throw new BadRequestError(result.error.issues[0].message);
            }
            req.body = result.data;
            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = {
    validate
};