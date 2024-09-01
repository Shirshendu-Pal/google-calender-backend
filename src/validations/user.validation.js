const Joi = require("joi");

module.exports.userDetails = {
    body: Joi.object().keys({
        userId: Joi.string().required(),   
    }),
};
module.exports.editUser = {
    body: Joi.object().keys({
        userId: Joi.string().required(), 
        bio: Joi.string().required(),
        profilePicIsDeleted: Joi.boolean().required()
    }),
};

module.exports.addEvent ={
    body: Joi.object().keys({
        userId: Joi.string().required(),
        summary: Joi.string().required(),
        description: Joi.string().required(), 
        start: Joi.object().required(), 
        end: Joi.object().required(), 
        attendees: Joi.array().required(),
    }),
}
module.exports.getAllEvents ={
    body: Joi.object().keys({
        userId: Joi.string().required(),
        startDate: Joi.string().required(),
        endDate: Joi.string().required()
    }),
}
module.exports.editEvent ={
    body: Joi.object().keys({
        userId: Joi.string().required(),
        google_event_id: Joi.string().required(),
        summary: Joi.string().required(),
        description: Joi.string().required(), 
        start: Joi.object().required(), 
        end: Joi.object().required(), 
        attendees: Joi.array().required(),
    }),
}
module.exports.deleteEvent ={
    body: Joi.object().keys({
        userId: Joi.string().required(),
        google_event_id: Joi.string().required()
    }),
}