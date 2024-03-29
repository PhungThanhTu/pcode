var express = require('express');
const { randomUUID } = require('crypto');
const { handleExceptionInResponse } = require('../exception');
const { authorizedRoute, checkUserBanned } = require('../middlewares/auth.middleware');
const { verifyExistingDocument, verifyRoleDocument } = require('../middlewares/document.middleware');
const { exerciseCreateSchema, exerciseEditSchema, sampleSourceCodeSchema } = require('../schema/exercise.schema');
const { createExerciseInDocumentSql, updateExerciseInDocumentSql, getExerciseInDocumentSql, mergeSampleSourceCodeInDocumentSql, getSampleSourceCodeInDocumentSql } = require('../models/exercise.model');
const { getProgrammingLanguagesSql } = require('../models/submission.model');

var router = express.Router({ mergeParams: true });

router.use(authorizedRoute);
router.use(checkUserBanned);
router.use(verifyExistingDocument);

router.post('/', verifyRoleDocument(0), async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const exerciseId = randomUUID();

        const createExerciseRequest = req.body;
        const {
            runtimeLimit,
            memoryLimit,
            scoreWeight,
            manualPercentage,
            judgerId
        } = await exerciseCreateSchema.validateAsync(createExerciseRequest);

        await createExerciseInDocumentSql(
            exerciseId, 
            documentId, 
            runtimeLimit, 
            memoryLimit, 
            scoreWeight, 
            manualPercentage,
            judgerId
            );

        return res.status(201).json({
            exerciseId,
            runtimeLimit,
            memoryLimit,
            scoreWeight,
            manualPercentage
        });
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
});

router.patch('/', verifyRoleDocument(0), async (req, res) => {
    try {
        const documentId = req.params.documentId;

        const updateExerciseRequest = req.body;

        const {
            runtimeLimit,
            memoryLimit,
            scoreWeight,
            manualPercentage,
            haveDeadline,
            deadline,
            strictDeadline,
            judgerId
        } = await exerciseEditSchema.validateAsync(updateExerciseRequest);

        await updateExerciseInDocumentSql(
            documentId,
            runtimeLimit,
            memoryLimit,
            scoreWeight,
            manualPercentage,
            haveDeadline,
            deadline,
            strictDeadline,
            judgerId
        );

        return res.sendStatus(200);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
});

router.get('/', verifyRoleDocument(0,1), async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const response = await getExerciseInDocumentSql(documentId);

        if(!response)
            return res.sendStatus(404);
        return res.status(200).json(response);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

router.get('/sample', verifyRoleDocument(0, 1), async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const programmingLanguageId = Number(req.query.programmingLanguage);

        const programmingLanguages = await getProgrammingLanguagesSql();

        if(!programmingLanguages.includes(programmingLanguageId))
        {
            return res.status(403).send("programming language not supported");
        }

        const response = await getSampleSourceCodeInDocumentSql(documentId, programmingLanguageId);

        return res.json(response);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

router.post('/sample', verifyRoleDocument(0), async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const programmingLanguageId = Number(req.query.programmingLanguage);
        const sampleSourceCode = req.body;
        const validatedSourceCode = await sampleSourceCodeSchema.validateAsync(sampleSourceCode)

        const programmingLanguages = await getProgrammingLanguagesSql();

        if(!programmingLanguages.includes(programmingLanguageId))
        {
            return res.status(403).send("programming language not supported");
        }
        
        const document = await getExerciseInDocumentSql(documentId);

        if(!document)
        {
            return res.status(404).send("This document has no exercise");
        }

        await mergeSampleSourceCodeInDocumentSql(documentId, programmingLanguageId, validatedSourceCode.sampleSourceCode);

        return res.json(
            {
                documentId,
                programmingLanguageId,
                validatedSourceCode
            })
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

module.exports = router;