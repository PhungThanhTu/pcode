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
    
}