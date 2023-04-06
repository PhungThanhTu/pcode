const joi = require('joi')

exports.documentCreationSchema = joi.object({
    courseId: joi.string().guid().required(),
    title: joi.string().required(),
    description: [joi.string().optional(), joi.allow(null,'')],
    hasExercise: joi.boolean().required()
})