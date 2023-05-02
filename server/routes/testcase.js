var express = require('express');
const { handleExceptionInResponse } = require('../exception');
const { verifyExistingDocument, verifyRoleDocument } = require('../middlewares/document.middleware');
const { getTestcaseMaxIdByDocumentIdSql, getTestCaseNewOrderByDocumentIdSql, createTestCaseInDocumentSql, getTestCasesByDocumentIdSql } = require('../models/testcases.model');
const { testCaseSchema } = require('../schema/testcases.schema');

var router = express.Router({ mergeParams: true });

router.use(verifyExistingDocument);

router.post('/', async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const testCaseRequest = req.body;

        const {
            input,
            output,
            scoreWeight,
            visibility
        } = await testCaseSchema.validateAsync(testCaseRequest);

        const maxId = await getTestcaseMaxIdByDocumentIdSql(documentId);
        const maxOrder = await getTestCaseNewOrderByDocumentIdSql(documentId);

        const testCaseId = maxId + 1;
        const testCaseOrder = maxOrder + 1;

        await createTestCaseInDocumentSql(testCaseId, 
            documentId,
            input,
            output,
            scoreWeight,
            visibility,
            testCaseOrder);

        return res.status(201).json({
            id: testCaseId,
            order: testCaseOrder,
            input,
            output,
            scoreWeight,
            visibility
        });
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

router.get('/', async (req, res) => {
    try {
        const documentId = req.params.documentId;

        const response = await getTestCasesByDocumentIdSql(documentId);

        return res.status(200).json(response);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

module.exports = router;