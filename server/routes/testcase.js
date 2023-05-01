var express = require('express');
const { handleExceptionInResponse } = require('../exception');
const { verifyExistingDocument, verifyRoleDocument } = require('../middlewares/document.middleware');
const { getTestcaseMaxIdByDocumentIdSql, getTestCaseNewOrderByDocumentIdSql } = require('../models/testcases.model');
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

        const testCaseId = await getTestcaseMaxIdByDocumentIdSql(documentId);
        const testCaseOrder = await getTestCaseNewOrderByDocumentIdSql(documentId);

        return res.json({
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

module.exports = router;