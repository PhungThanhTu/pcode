const { randomUUID } = require('crypto');
var express = require('express');
const { handleExceptionInResponse } = require('../exception');

const { authorizedRoute } = require('../middlewares/auth.middleware');
const { getCourseByIdSql } = require('../models/course.model');
const { createDocumentSql, linkDocumentWithCourseSql } = require('../models/document.model');
const { documentCreationSchema } = require('../schema/document.schema');
var router = express.Router();

router.post('/', authorizedRoute , async (req, res) => {
    try 
    {
        const identity = req.identity;
        const documentCreateRequest = req.body;
        const validatedDocumentCreateRequest = await documentCreationSchema.validateAsync(documentCreateRequest);

        const courseId = validatedDocumentCreateRequest.courseId;
        
        const course = await getCourseByIdSql(courseId);

        if(!course){
            return res.status(404).send("Course not found");
        }

        const newDocumentId = randomUUID();

        const newDocument = {
            Id: newDocumentId,
            CourseId: courseId,
            Title: validatedDocumentCreateRequest.title,
            Description: validatedDocumentCreateRequest.description,
            HasExercise: validatedDocumentCreateRequest.hasExercise
        }

        await createDocumentSql(newDocumentId, newDocument.Title, newDocument.Description, identity, newDocument.HasExercise);

        await linkDocumentWithCourseSql(newDocumentId, newDocument.CourseId);



        return res.status(201).json(newDocument);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err)
    }
});

module.exports = router;