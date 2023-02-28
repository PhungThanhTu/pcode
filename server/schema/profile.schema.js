const joi = require('joi');

exports.updateProfileRequestSchema = joi.object({
    fullName: joi.string().required(),
    email: joi.string().required()
});

exports.changePasswordRequestSchema = joi.object({
    password: joi.string()
        .min(3)
        .required(),
    newPassword: joi.string()
        .min(3)
        .required(),
})