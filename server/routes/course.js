const { randomUUID } = require('crypto');
var express = require('express');
const { handleExceptionInResponse } = require('../exception');
const { authorizedRoute } = require('../middlewares/auth.middleware');
const { createCourseSql, getAllCourseSql, renameCourseSql, getCourseTitleUsingInvitationCodeSql, getCourseByIdSql, getDocumentsInCourseSql, getAllDocumentsInCourseSql, getPublishedDocumentInCourseSql } = require('../models/course.model');
const { grantRoleToCourseSql, getRoleOfCourseSql } = require('../models/right.model');
const { courseCreateRequestSchema } = require('../schema/course.schema');
const { nanoid } = require('nanoid');
const { createInvitationSql, getInvitationSql } = require('../models/invitation.model');
var router = express.Router();
const joi = require('joi');
const { getStudentScoreInCourseSql, getAllDetailScoreInCourseSql } = require('../models/scoring.model');

router.post('/', authorizedRoute, async (req,res) => {
    try {
        const courseCreateRequest =  req.body;
        const identity = req.identity;
        
        const validatedCourseCreateRequest = await courseCreateRequestSchema.validateAsync(courseCreateRequest);

        const title = validatedCourseCreateRequest.title;
        const subject = validatedCourseCreateRequest.subject;
        const theme = validatedCourseCreateRequest.theme;

        const courseId = randomUUID();
        const invitationId = nanoid(5);



        await createCourseSql(courseId, title, subject, theme);

        await grantRoleToCourseSql(identity, courseId, 0);

        console.log(invitationId);

        await createInvitationSql(courseId, 1, invitationId);

        return res.status(201).json({
            id: courseId,
            CreatorId: identity,
            Code: invitationId,
            title: title,
            subject: subject,
            theme: theme
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

router.get('/:id', authorizedRoute, async (req,res) => {
    const identity = req.identity;
    const courseId = req.params.id;

    try {
        await joi.string().uuid().validateAsync(courseId);

        const role = await getRoleOfCourseSql(identity, courseId);

        if(!role) {
            return res.sendStatus(404);
        }

        const course = await getCourseByIdSql(courseId);

        let documents;

        if(role.Role === 0)
        {
            documents = await getAllDocumentsInCourseSql(courseId);

        }
        else {
            documents = await getPublishedDocumentInCourseSql(courseId);
        }

        const response = {
            ...course,
            documents
        }

        return res.status(200).json(response);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

router.post('/join/:code', authorizedRoute, async (req, res) => {
    try {
        const identity = req.identity;

        const invitationCode = req.params.code;

        await joi.string().min(5).max(5).validateAsync(invitationCode);

        const invitationRecord = await getInvitationSql(invitationCode);

        if(!invitationRecord)
            return res.sendStatus(404);
        
        const courseId = invitationRecord.CourseId;
        const roleId = invitationRecord.PlpRoleId;

        // if user is already an owner, do not grant role
        const userRole = await getRoleOfCourseSql(identity, courseId);

        if(userRole && userRole.Role == 0){
            return res.status(201).json({
                courseId
            });
        }

        await grantRoleToCourseSql(identity, courseId, roleId);

        return res.status(201).json({
            courseId
        });

    }
    catch (err)
    {
        return handleExceptionInResponse(res,err);
    }
});

router.put('/:id', authorizedRoute, async ( req,res) => {

    const identity = req.identity;

    const courseId = req.params.id;

    const newTitle = req.body.title;

    try {

        await joi.string().uuid().validateAsync(courseId);
        await joi.string().min(1).validateAsync(newTitle);

        const role = await getRoleOfCourseSql(identity, courseId);

        if( !role || role.Role !== 0)
        {
            return res.sendStatus(404);
        }

        await renameCourseSql(courseId,newTitle);

        return res.sendStatus(200);
    }
    catch (err) {

    }
})

router.get('/info/:code', async (req,res) => {
    try {

        const invitationCode = req.params.code;

        await joi.string().min(5).max(5).validateAsync(invitationCode);

        const course = await getCourseTitleUsingInvitationCodeSql(invitationCode);

        if(!course)
            return res.sendStatus(404);

        return res.status(200).json(course);
    }
    catch (err)
    {
        return handleExceptionInResponse(res,err);
    }
})

router.get('/:id/score', authorizedRoute, async (req, res) => {
    const identity = req.identity;
    const courseId = req.params.id;

    try {
        await joi.string().uuid().validateAsync(courseId);

        const role = await getRoleOfCourseSql(identity, courseId);

        if(!role) {
            return res.sendStatus(404);
        }

        if(!role.Role === 0)
        {
            return res.sendStatus(404);

        }

        const details = await getAllDetailScoreInCourseSql(courseId);
        const scores = await getStudentScoreInCourseSql(courseId);
        const result = scores.map(score => {
            const userScores = details.filter(i => i.UserId === score.UserId);
            return {...score,Details:userScores};
          })
        return res.status(200).json(result);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

module.exports = router;