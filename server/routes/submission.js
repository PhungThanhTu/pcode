var express = require('express');
const { handleExceptionInResponse } = require('../exception');
const { authorizedRoute } = require('../middlewares/auth.middleware');
const { verifyExistingDocument } = require('../middlewares/document.middleware');
const { submissionCreationSchema } = require('../schema/submission.schema');
const { randomUUID } = require('crypto');
const { getProgrammingLanguagesSql, createSubmissionInDocumentSql } = require('../models/submission.model');
var router = express.Router({mergeParams: true});

router.use(authorizedRoute);
router.use(verifyExistingDocument);

router.post('/', async (req,res) => {
    try {
        const userId = req.identity;
        const id = randomUUID();
        const documentId = req.params.documentId;
        const programmingLanguageId = Number(req.query.programmingLanguage);
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

module.exports = router;