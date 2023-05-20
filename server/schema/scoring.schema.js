const joi = require('joi');

exports.manualScoringSchema = joi.object({
    score: joi.number().required()
        .min(0).max(10)
});