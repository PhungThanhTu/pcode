const joi = require('joi');

exports.registerRequestSchema = joi.object({
    username: joi.string()
        .min(3)
        .max(20)
        .required(),
    password: joi.string()
        .min(3)
        .required(),
    email: joi.string().required(),
    fullName: joi.string().required()
});

exports.loginRequestSchema = joi.object({
    username: joi.string().max(30).required(),
    password: joi.string().required()
})

exports.refreshRequestSchema = joi.object({
    token: joi.string().required(),
    refreshToken: joi.string().required() 
})