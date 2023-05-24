const joi = require('joi')
    .extend(require('@joi/date'));;
const { 
    DEFAULT_MANUAL_PERCENTAGE, 
    DEFAULT_MEMORY_LIMIT, 
    DEFAULT_RUNTIME_LIMIT, 
    DEFAULT_SCORE_WEIGHT }  
        = require('../constants').defaultExerciseConfiguration;

exports.exerciseCreateSchema = joi.object(
    {
        runtimeLimit: joi.number()
            .integer()
            .min(0)
            .optional()
            .default(DEFAULT_RUNTIME_LIMIT),
        memoryLimit: joi.number()
            .integer()
            .min(0)
            .optional()
            .default(DEFAULT_MEMORY_LIMIT),
        scoreWeight: joi.number()
            .integer()
            .min(0)
            .default(DEFAULT_SCORE_WEIGHT),
        manualPercentage: joi.number()
            .min(0)
            .max(1)
            .optional()
            .default(DEFAULT_MANUAL_PERCENTAGE),
        judgerId: joi.string()
            .uuid()
            .required()
    }
)

exports.exerciseEditSchema = joi.object(
    {
        runtimeLimit: joi.number()
            .integer()
            .min(0)
            .optional()
            .default(null),
        memoryLimit: joi.number()
            .integer()
            .min(0)
            .optional()
            .default(null),
        scoreWeight: joi.number()
            .integer()
            .min(0)
            .default(null),
        manualPercentage: joi.number()
            .min(0)
            .max(1)
            .optional()
            .default(null),
        haveDeadline: joi.boolean()
            .default(false),
        deadline: joi.date()
            .format('YYYY-MM-DD HH:mm')
            .default(null),
        strictDeadline: joi.boolean()
            .default(false),
        judgerId: joi.string()
            .uuid()
            .default(null)
    }
)

exports.sampleSourceCodeSchema = joi.object(
    {
        sampleSourceCode: joi.string().allow('').required()
    }
)