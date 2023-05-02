var express = require('express');
const { handleExceptionInResponse } = require('../exception');
const { verifyExistingDocument, verifyRoleDocument } = require('../middlewares/document.middleware');
const { getTestcaseMaxIdByDocumentIdSql, getTestCaseNewOrderByDocumentIdSql, createTestCaseInDocumentSql, getTestCasesByDocumentIdSql, getTestCaseByDocumentIdSql, updateTestCaseByDocumentIdSql, deleteTestCaseByDocumentIdSql, swapTestCaseOrderDocumentIdSql } = require('../models/testcases.model');
const { testCaseSchema } = require('../schema/testcases.schema');

var router = express.Router({ mergeParams: true });

router.use(verifyExistingDocument);

router.post('/', verifyRoleDocument(0), async (req, res) => {
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

router.get('/', verifyRoleDocument(0,1), async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const role = req.role;

        const isCreator = role === 0;
        const response = await getTestCasesByDocumentIdSql(documentId, isCreator);

        return res.status(200).json(response);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

router.get('/:id', verifyRoleDocument(0,1), async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const id = req.params.id;
        const testcase = await getTestCaseByDocumentIdSql(documentId, id);
        const role = req.role;
        if(!testcase || (!testcase.visibility && role !== 0)) return res.sendStatus(404);
        
        return res.status(200).json(testcase);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

router.patch('/:id', verifyRoleDocument(0), async (req, res) => {
    try {
        console.log('Getting ');
        const documentId = req.params.documentId;
        const id = req.params.id;
        const testCaseRequest = req.body;

        const testcase = await getTestCaseByDocumentIdSql(documentId, id);

        if(!testcase) return res.sendStatus(404);
      
        const {
            input,
            output,
            scoreWeight,
            visibility
        } = await testCaseSchema.validateAsync(testCaseRequest);

        await updateTestCaseByDocumentIdSql(
            documentId,
            id,
            input,
            output,scoreWeight,
            visibility
        )

        return res.sendStatus(200);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

router.post('/swap', verifyRoleDocument(0), async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const order1 = req.query.order1;
        const order2 = req.query.order2;

        const maxOrder = await getTestCaseNewOrderByDocumentIdSql(documentId);

        if(order1 > maxOrder || order2 > maxOrder)
            return res.status(400).send("Invalid test case order id");

        if(order1 === undefined || order2 === undefined){
            return res.status(400).send("swap parameters not found");
        }

        await swapTestCaseOrderDocumentIdSql(documentId, order1, order2);

        return res.sendStatus(200);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

router.delete('/:id' , verifyRoleDocument(0), async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const id = req.params.id;
        const testcase = await getTestCaseByDocumentIdSql(documentId, id);

        if(!testcase) return res.sendStatus(404);
        
        await deleteTestCaseByDocumentIdSql(documentId, id);

        return res.sendStatus(200);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

module.exports = router;