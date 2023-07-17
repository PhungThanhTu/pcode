var express = require('express');
const { handleExceptionInResponse } = require('../exception');
const { verifyExistingDocument, verifyRoleDocument } = require('../middlewares/document.middleware');
const { getTestcaseMaxIdByDocumentIdSql, getTestCaseNewOrderByDocumentIdSql, createTestCaseInDocumentSql, getTestCasesByDocumentIdSql, getTestCaseByDocumentIdSql, updateTestCaseByDocumentIdSql, deleteTestCaseByDocumentIdSql, swapTestCaseOrderDocumentIdSql } = require('../models/testcases.model');
const { userTestcaseSchema, userTestcaseUpdateSchema } = require('../schema/usertestcase.schema');
const { getFirstExerciseIdInDocumentSql, getFirstExerciseByDocumentIdSql } = require('../models/document.model');
const { getMaxIdUserTestcaseSql, getNewOrderUserTestcaseSql, createUserTestcaseSql, getAllUserTestcaseSql, getUserTestcaseSql, updateUserTestcaseSql, deleteUserTestcaseSql, swapUserTestcaseSql } = require('../models/usertestcase.model');

var router = express.Router({ mergeParams: true });

router.use(verifyExistingDocument);
router.use(verifyRoleDocument(0,1));

router.post('/', async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const userId = req.identity;
        const testCaseRequest = req.body;
        const exercise = await getFirstExerciseByDocumentIdSql(documentId);
        if(!exercise)
            return res.status(404).send("Exercise Not found");

        const exerciseId = exercise.ExerciseId;
        const maxId = await getMaxIdUserTestcaseSql(exerciseId, userId);
        const maxOrder = await getNewOrderUserTestcaseSql(exerciseId, userId);

        const id = maxId + 1;
        const order = maxOrder + 1;

        console.log(maxId);
        console.log(id);

        const {
            input,
            output
        } = await userTestcaseSchema.validateAsync(testCaseRequest);

        await createUserTestcaseSql(
            id,
            userId,
            exerciseId,
            input,
            output,
            order);

        return res.status(201).json({
            id,
            order,
            input,
            output
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
        const userId = req.identity;
        const exercise = await getFirstExerciseByDocumentIdSql(documentId);
        if(!exercise)
            return res.status(404).send("Exercise Not found");

        const exerciseId = exercise.ExerciseId;

        const response = await getAllUserTestcaseSql(userId, exerciseId);

        return res.json(response);

    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const id = req.params.id;
        const userId = req.identity;

        const exercise = await getFirstExerciseByDocumentIdSql(documentId);
        if(!exercise)
            return res.status(404).send("Exercise Not found");

        const exerciseId = exercise.ExerciseId;

        const response = await getUserTestcaseSql(exerciseId, userId, id);

        if(!response) return res.sendStatus(404);

        return res.json(response);

    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

router.patch('/:id', async (req, res) => {

    try {
        const documentId = req.params.documentId;
        const userId = req.identity;
        const id = req.params.id;
        const testCaseRequest = req.body;
        const exercise = await getFirstExerciseByDocumentIdSql(documentId);
        if(!exercise)
            return res.status(404).send("Exercise Not found");

        const exerciseId = exercise.ExerciseId;
        const testcase = await getUserTestcaseSql(exerciseId, userId, id);
        if(!testcase)
            return res.sendStatus(404);

        const {
            input,
            output
        } = await userTestcaseUpdateSchema.validateAsync(testCaseRequest);

        await updateUserTestcaseSql(
            id,
            userId,
            exerciseId,
            input,
            output
        );

        return res.sendStatus(200);   
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

router.delete('/:id', async (req, res) => {

    try {
        const documentId = req.params.documentId;
        const userId = req.identity;
        const id = req.params.id;;
        const exercise = await getFirstExerciseByDocumentIdSql(documentId);
        if(!exercise)
            return res.status(404).send("Exercise Not found");

        const exerciseId = exercise.ExerciseId;
        const testcase = await getUserTestcaseSql(exerciseId, userId, id);
        if(!testcase)
            return res.sendStatus(404);

        await deleteUserTestcaseSql(
            exerciseId,
            userId,
            id);

        return res.sendStatus(200);   
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

router.post('/:swap', async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const userId = req.identity;
        const id = req.params.id;;
        const exercise = await getFirstExerciseByDocumentIdSql(documentId);
        if(!exercise)
            return res.status(404).send("Exercise Not found");

        const exerciseId = exercise.ExerciseId;
        const order1 = req.query.order1;
        const order2 = req.query.order2;

        const maxOrder = await getNewOrderUserTestcaseSql(exerciseId, userId);

        if(order1 === undefined || order2 === undefined){
            return res.status(400).send("swap parameters not found");
        }

        if(order1 > maxOrder || order2 > maxOrder)
            return res.status(400).send("Invalid test case order id");

        await swapUserTestcaseSql(
            exerciseId,
            userId,
            order1,
            order2
        );
        return res.sendStatus(200);
    }
    catch (err)
    {

    }
})

module.exports = router;