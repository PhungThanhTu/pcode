const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');
const { getInstance } = require('./pool');

exports.getTestcaseMaxIdByDocumentIdSql = async (documentId) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .query('exec GetTestCaseMaxIdByDocumentId @DocumentId');

    const result = request.recordset[0].Id;
    return result;
}

exports.getTestCaseNewOrderByDocumentIdSql = async (documentId) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .query('exec GetTestCaseNewOrderByDocumentId @DocumentId');

    const result = request.recordset[0].TestOrder;
    return result;
}

exports.createTestCaseInDocumentSql = async (
    id,
    documentId,
    input,
    output,
    scoreWeight,
    visibility,
    testOrder
) => {
   const pool = await getInstance();
   
   await pool.request()
    .input('Id', sql.Int, id)
    .input('DocumentId', sql.UniqueIdentifier, documentId)
    .input('Input', sql.NVarChar, input)
    .input('ExpectedOutput', sql.NVarChar, output)
    .input('ScoreWeight', sql.Int, scoreWeight)
    .input('Visibility', sql.Bit, visibility)
    .input('TestOrder', sql.Int, testOrder)
    .execute('CreateTestCaseInDocument');

    return;
}

exports.getTestCasesByDocumentIdSql = async (documentId, isCreator) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('IsCreator', sql.Bit, isCreator)
        .query('exec GetTestCasesByDocumentId @DocumentId, @IsCreator');

    const result = request.recordset;
    return result;
}

exports.getTestCaseByDocumentIdSql = async (documentId, id) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('Id', sql.Int, id)
        .query('exec GetTestCaseInDocument @DocumentId, @Id');
    
    const result = request.recordset[0];

    return result;
}

exports.updateTestCaseByDocumentIdSql = async (
    documentId,
    id,
    input,
    output,
    scoreWeight,
    visibility
) => {
    const pool = await getInstance();
   
   await pool.request()
    .input('Id', sql.Int, id)
    .input('DocumentId', sql.UniqueIdentifier, documentId)
    .input('Input', sql.NVarChar, input)
    .input('ExpectedOutput', sql.NVarChar, output)
    .input('ScoreWeight', sql.Int, scoreWeight)
    .input('Visibility', sql.Bit, visibility)
    .execute('UpdateTestCaseUsingDocumentId');


    return;
}

exports.deleteTestCaseByDocumentIdSql = async (documentId, id) => {
    const pool = await getInstance();

    await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('Id', sql.Int, id)
        .execute('DeleteATestCaseInDocument');

    return;
}

exports.swapTestCaseOrderDocumentIdSql = async (documentId, order1, order2) => {
    const pool = await getInstance();

    await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('TestOrder1', sql.Int, order1)
        .input('TestOrder2', sql.Int, order2)
        .execute('SwapTestCaseOrderInDocument');


    return;
}