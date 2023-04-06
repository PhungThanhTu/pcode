const joi = require('joi');

exports.courseCreateRequestSchema = joi.object({
    title: joi.string()
        .required(),
    subject: joi.string(),
    theme: [joi.string().optional(), joi.allow(null,'')]
});