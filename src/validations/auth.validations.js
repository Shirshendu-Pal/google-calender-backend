const Joi = require("joi");

module.exports.loginUser = {
    body: Joi.object().keys({
        code: Joi.string().required()
    })
};