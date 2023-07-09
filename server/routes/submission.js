var express = require('express');
const { handleExceptionInResponse } = require('../exception');
const { authorizedRoute, checkUserBanned } = require('../middlewares/auth.middleware');
const { verifyExistingDocument, verifyRoleDocument } = require('../middlewares/document.middleware');
const { submissionCreationSchema } = require('../schema/submission.schema');
const { randomUUID } = require('crypto');
const { getProgrammingLanguagesSql, createSubmissionInDocumentSql, getMySubmissionInDocumentSql, checkOwnerSubmissionSql, markSubmissionSql, getSingleSubmissionSql, deleteSubmissionByIdSql, getStudentMarkedSubmissionsInDocumentSql, getTestResultBySubmissionIdSql } = require('../models/submission.model');
const { getExerciseInDocumentSql } = require('../models/exercise.model');
const { trySendingMessage } = require('../publisher');
const { manualScoringSchema } = require('../schema/scoring.schema');
const { scoreSubmissionManuallySql } = require('../models/scoring.model');
var router = express.Router({mergeParams: true});

const DEADLINE_TOLERANCE_IN_MINUTES = 10;

router.use(authorizedRoute);
router.use(checkUserBanned);
router.use(verifyExistingDocument);

router.post('/', verifyRoleDocument(0,1), async (req,res) => {
    try {
        const userId = req.identity;
        const id = randomUUID();
        const documentId = req.params.documentId;
        const programmingLanguageId = Number(req.query.programmingLanguage);

        const exercise = await getExerciseInDocumentSql(documentId);

        const haveDeadline = exercise.HaveDeadline;
        const deadline = exercise.Deadline;
        const strictDeadline = exercise.StrictDeadline;

        const deadlineDate = new Date(deadline);
        deadlineDate.setMinutes(deadlineDate.getMinutes() + DEADLINE_TOLERANCE_IN_MINUTES);
        const deadlineTimestamp = deadlineDate.getTime();
        
        const dateNowTimestamp = new Date().getTime();

        if(haveDeadline && strictDeadline && dateNowTimestamp > deadlineTimestamp)
        {
            return res.status(410).send("Submission Overdue");
        }

        const submissionCreateRequest = req.body;

        const programmingLanguages = await getProgrammingLanguagesSql();

        if(!programmingLanguages.includes(programmingLanguageId))
        {
            return res.status(403).send("programming language not supported");
        }

        const {
            sourceCode
        } = await submissionCreationSchema.validateAsync(submissionCreateRequest);

        await createSubmissionInDocumentSql(id, documentId, userId, programmingLanguageId, sourceCode);

        const messageObject = {
            submissionId: id,
            type: 'JUDGE'
        }

        const messageJson = JSON.stringify(messageObject);

        await trySendingMessage(messageJson);

        return res.status(201).json({
            id,
            programmingLanguageId,
            sourceCode
        })
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
});

router.get('/', verifyRoleDocument(0,1), async (req, res) => {
    try {
        const userId = req.identity;
        const documentId = req.params.documentId;

        const result = await getMySubmissionInDocumentSql(documentId, userId);

        return res.json(result);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
        
});

router.get('/manage', verifyRoleDocument(0), async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const submissions = await getStudentMarkedSubmissionsInDocumentSql(documentId);

        return res.json(submissions);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

router.post('/regrade', verifyRoleDocument(0), async (req,res) => {
    try {
        const documentId = req.params.documentId;
        const submissions = await getStudentMarkedSubmissionsInDocumentSql(documentId);
        for ( const submission of submissions) {
            const submissionId = submission.SubmissionId;
            const messageObject = {
                submissionId: submissionId,
                type: 'JUDGE'
            }
    
            const messageJson = JSON.stringify(messageObject);
    
            await trySendingMessage(messageJson);
            console.log(submissionId);
        }
        return res.sendStatus(200);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

router.get('/:id', verifyRoleDocument(0,1), async (req, res) => {
    try {
        const userId = req.identity;
        const submissionId = req.params.id;

        const isCreator = req.role === 0;

        const isOwner = await checkOwnerSubmissionSql(submissionId, userId);

        if(!isOwner && !isCreator)
        {
            return res.sendStatus(404);
        }

        const submission = await getSingleSubmissionSql(submissionId);

        const submissionTestResult = await getTestResultBySubmissionIdSql(submissionId);


        return res.json({
            ...submission,
            testResults: submissionTestResult
        });
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
});

router.post('/:id/mark', verifyRoleDocument(0,1), async (req, res) => {
    try {
        const userId = req.identity;
        const submissionId = req.params.id;

        const isOwner = await checkOwnerSubmissionSql(submissionId, userId);

        console.log(isOwner);
        if(!isOwner)
        {
            return res.sendStatus(404);
        }

        await markSubmissionSql(submissionId);

        return res.sendStatus(200);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
});

router.delete('/:id', verifyRoleDocument(0,1), async (req, res) => {
    try {
        const userId = req.identity;
        const submissionId = req.params.id;

        const isOwner = await checkOwnerSubmissionSql(submissionId, userId);

        console.log(isOwner);
        if(!isOwner)
        {
            return res.sendStatus(404);
        }

        await deleteSubmissionByIdSql(submissionId);

        return res.sendStatus(200);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
});

router.post('/:id/score' , verifyRoleDocument(0), async (req, res) => {
    const submissionId = req.params.id;

    const manualScoringRequest = req.body;
    try {
        const {
            score
        } = await manualScoringSchema.validateAsync(manualScoringRequest);
        
        await scoreSubmissionManuallySql(submissionId, score);

        return res.json({
            submissionId,
            score
        })
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

module.exports = router;