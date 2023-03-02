const { randomUUID } = require('crypto');
var express = require('express');
const { handleExceptionInResponse } = require('../exception');
const { authorizedRoute } = require('../middlewares/auth.middleware');
const { createCourseSql } = require('../models/course.model');
const { grantRoleToCourseSql } = require('../models/right.model');
const { courseCreateRequestSchema } = require('../schema/course.schema');
var router = express.Router();

router.post('/', authorizedRoute, async (req,res) => {
    try {
        const courseCreateRequest =  req.body;
        const identity = req.identity;
        
        const validatedCourseCreateRequest = await courseCreateRequestSchema.validateAsync(courseCreateRequest);

        const title = validatedCourseCreateRequest.title;
        const courseId = randomUUID();

        await createCourseSql(courseId, title);

        await grantRoleToCourseSql(identity, courseId, 'creator')

        return res.sendStatus(201);
    }
    catch (err)
    {
        return handleExceptionInResponse(res,err);
    }
});

module.exports = router;