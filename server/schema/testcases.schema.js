const joi = require('joi');

const { 
    DEFAULT_INPUT,
    DEFAULT_OUTPUT,
    DEFAULT_SCORE_WEIGHT,
    DEFAULT_VISIBILITY,
}  = require('../constants').defaultTestcaseConfiguration;

exports.testCaseSchema = joi.object({
    input: joi.string().allow('').default(DEFAULT_INPUT),
    output: joi.string().allow('').default(DEFAULT_OUTPUT),
    scoreWeight: joi.number().default(DEFAULT_SCORE_WEIGHT),
    visibility: joi.boolean().default(DEFAULT_VISIBILITY)
})

exports.testCaseUpdateSchema = exports.testCaseSchema = joi.object({
    input: joi.string().allow('').default(null),
    output: joi.string().allow('').default(null),
    scoreWeight: joi.number().default(null),
    visibility: joi.boolean().default(null)
})