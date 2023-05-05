const joi = require('joi');

exports.contentUpdateSchema = joi.object(
    {
        content: joi.string().allow('').required()
    }
)