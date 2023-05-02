const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

exports.getTestcaseMaxIdByDocumentIdSql = async (documentId) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .query('exec GetTestCaseMaxIdByDocumentId @DocumentId');
    
    await pool.close();

    const result = request.recordset[0].Id;
    return result;
}

exports.getTestCaseNewOrderByDocumentIdSql = async (documentId) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .query('exec GetTestCaseNewOrderByDocumentId @DocumentId');
    
    await pool.close();

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
   const pool = await sql.connect(sqlConfig);
   
   await pool.request()
    .input('Id', sql.Int, id)
    .input('DocumentId', sql.UniqueIdentifier, documentId)
    .input('Input', sql.NVarChar, input)
    .input('ExpectedOutput', sql.NVarChar, output)
    .input('ScoreWeight', sql.Int, scoreWeight)
    .input('Visibility', sql.Bit, visibility)
    .input('TestOrder', sql.Int, testOrder)
    .execute('CreateTestCaseInDocument');

    await pool.close();

    return;
}

exports.getTestCasesByDocumentIdSql = async (documentId, isCreator) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('IsCreator', sql.Bit, isCreator)
        .query('exec GetTestCasesByDocumentId @DocumentId, @IsCreator');
    
    await pool.close();

    const result = request.recordset;
    return result;
}

exports.getTestCaseByDocumentIdSql = async (documentId, id) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('Id', sql.Int, id)
        .query('exec GetTestCaseInDocument @DocumentId, @Id');
    
    await pool.close();
    
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
    const pool = await sql.connect(sqlConfig);
   
   await pool.request()
    .input('Id', sql.Int, id)
    .input('DocumentId', sql.UniqueIdentifier, documentId)
    .input('Input', sql.NVarChar, input)
    .input('ExpectedOutput', sql.NVarChar, output)
    .input('ScoreWeight', sql.Int, scoreWeight)
    .input('Visibility', sql.Bit, visibility)
    .execute('UpdateTestCaseUsingDocumentId');

    await pool.close();

    return;
}

exports.deleteTestCaseByDocumentIdSql = async (documentId, id) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('Id', sql.Int, id)
        .execute('DeleteATestCaseInDocument');
    
    await pool.close();

    return;
}

exports.swapTestCaseOrderDocumentIdSql = async (documentId, order1, order2) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('TestOrder1', sql.Int, order1)
        .input('TestOrder2', sql.Int, order2)
        .execute('SwapTestCaseOrderInDocument');
    
    await pool.close();

    return;
}