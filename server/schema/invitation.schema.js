const joi = require('joi');

exports.courseStudentInvitationCreationSchema = joi.object({
    courseId: joi.string().guid().required(),
})