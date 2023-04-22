const joi = require('joi')

exports.documentCreationSchema = joi.object({
    courseId: joi.string().guid().required(),
    title: joi.string().max(320).required(),
    description: [joi.string().max(640).optional(), joi.allow(null,'')],
    hasExercise: joi.boolean().required()
})

exports.documentUpdateSchema = joi.object({
    title: joi.string().max(320).required(),
    description: [joi.string().max(640).optional(), joi.allow(null,'')],
})