const { randomUUID } = require('crypto');
var express = require('express');
const { handleExceptionInResponse } = require('../exception');
const { authorizedRoute } = require('../middlewares/auth.middleware');
const { createCourseSql, getAllCourseSql } = require('../models/course.model');
const { grantRoleToCourseSql } = require('../models/right.model');
const { courseCreateRequestSchema } = require('../schema/course.schema');
const { nanoid } = require('nanoid');
const { createInvitationSql } = require('../models/invitation.model');
var router = express.Router();

router.post('/', authorizedRoute, async (req,res) => {
    try {
        const courseCreateRequest =  req.body;
        const identity = req.identity;
        
        const validatedCourseCreateRequest = await courseCreateRequestSchema.validateAsync(courseCreateRequest);

        const title = validatedCourseCreateRequest.title;
        const courseId = randomUUID();
        const invitationId = nanoid(5);



        await createCourseSql(courseId, title);

        await grantRoleToCourseSql(identity, courseId, 0);

        console.log(invitationId);

        await createInvitationSql(courseId, 1, invitationId);

        return res.status(201).json({
            courseId: courseId,
            invitationId: invitationId
        })
    }
    catch (err)
    {
        return handleExceptionInResponse(res,err);
    }
});

router.get('/',authorizedRoute,async (req, res) => {
    try {
        const identity = req.identity;

        const courses = await getAllCourseSql(identity);

        return res.status(200).json(courses);
    }
    catch (err)
    {
        return handleExceptionInResponse(res,err);
    }
});

module.exports = router;