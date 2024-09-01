const Joi = require('joi');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const validate = (schema) => (req, res, next) => {

    const validSchema = pick(schema, ['body', 'params', 'query']);

    const object = pick(req, Object.keys(validSchema));

    const { value, error } = Joi.compile(validSchema).validate(object);

    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }

    Object.assign(req, value);

    next();
}

module.exports = validate;