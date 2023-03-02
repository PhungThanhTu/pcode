const joi = require('joi');

exports.courseCreateRequestSchema = joi.object({
    title: joi.string()
        .required(),
});