const joi = require('joi');

const { 
    DEFAULT_INPUT,
    DEFAULT_OUTPUT
}  = require('../constants').defaultTestcaseConfiguration;

exports.userTestcaseSchema = joi.object({
    input: joi.string().allow('').default(DEFAULT_INPUT),
    output: joi.string().allow('').default(DEFAULT_OUTPUT),
})

exports.userTestcaseUpdateSchema = exports.testCaseSchema = joi.object({
    input: joi.string().allow('').default(null),
    output: joi.string().allow('').default(null)
})