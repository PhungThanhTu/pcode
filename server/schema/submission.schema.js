const joi = require('joi');

exports.submissionCreationSchema = joi.object({
    sourceCode: joi.string().allow('').default('')
})