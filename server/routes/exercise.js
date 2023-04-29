var express = require('express');
const { randomUUID } = require('crypto');
const { handleExceptionInResponse } = require('../exception');
const { authorizedRoute } = require('../middlewares/auth.middleware');
const { verifyExistingDocument, verifyRoleDocument } = require('../middlewares/document.middleware');
const { exerciseCreateSchema, exerciseEditSchema } = require('../schema/exercise.schema');
const { createExerciseInDocumentSql, updateExerciseInDocumentSql, getExerciseInDocumentSql } = require('../models/exercise.model');

var router = express.Router({ mergeParams: true });

router.use(authorizedRoute);
router.use(verifyExistingDocument);

router.post('/', verifyRoleDocument(0), async (req,res) => {
    try {
        const documentId = req.params.documentId;
        const exerciseId = randomUUID();

        const createExerciseRequest = req.body;
        const {
            runtimeLimit,
            memoryLimit,
            scoreWeight,
            manualPercentage
        } = await exerciseCreateSchema.validateAsync(createExerciseRequest);

        await createExerciseInDocumentSql(
            exerciseId, 
            documentId, 
            runtimeLimit, 
            memoryLimit, 
            scoreWeight, 
            manualPercentage);

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
            strictDeadline
        } = await exerciseEditSchema.validateAsync(updateExerciseRequest);

        await updateExerciseInDocumentSql(
            documentId,
            runtimeLimit,
            memoryLimit,
            scoreWeight,
            manualPercentage,
            haveDeadline,
            deadline,
            strictDeadline
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

module.exports = router;