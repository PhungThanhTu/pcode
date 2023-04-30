const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

exports.createExerciseInDocumentSql = async (
    id,
    documentId,
    runtimeLimit,
    memoryLimit,
    scoreWeight,
    manualPercentage
    ) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('RuntimeLimit', sql.Int, runtimeLimit)
        .input('MemoryLimit', sql.Int, memoryLimit)
        .input('ScoreWeight', sql.Int, scoreWeight)
        .input('ManualPercentage', sql.Float, manualPercentage)
        .execute('CreateExerciseInDocument')

    await pool.close();
}

exports.updateExerciseInDocumentSql = async (
    documentId,
    runtimeLimit,
    memoryLimit,
    scoreWeight,
    manualPercentage,
    haveDeadline,
    deadline,
    strictDeadline
) => {

    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('RuntimeLimit', sql.Int, runtimeLimit)
        .input('MemoryLimit', sql.Int, memoryLimit)
        .input('ScoreWeight', sql.Int, scoreWeight)
        .input('ManualPercentage', sql.Float, manualPercentage)
        .input('HaveDeadline', sql.Bit, haveDeadline)
        .input('Deadline', sql.DateTime2, deadline)
        .input('StrictDeadline', sql.Bit, strictDeadline)
        .execute('UpdateExerciseByDocumentId');

    await pool.close();

}

exports.getExerciseInDocumentSql = async (
    documentId
) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .query('exec GetExerciseByDocumentId @DocumentId');
    
    await pool.close();

    const result = request.recordset[0];
    return result;
}

exports.mergeSampleSourceCodeInDocumentSql = async (
    documentId, 
    programmingLanguageId, 
    sourceCode) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('ProgrammingLanguageId', sql.Int, programmingLanguageId)
        .input('SourceCode', sql.NVarChar, sourceCode)
        .execute('MergeSampleSourceCodeByDocumentId');
    
    await pool.close();

    return;
}

exports.getSampleSourceCodeInDocumentSql = async (
    documentId,
    programmingLanguageId
) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('ProgrammingLanguageId', sql.Int, programmingLanguageId)
        .query('exec GetSampleSourceCodeByDocumentId @DocumentId, @ProgrammingLanguageId');
    
    await pool.close();

    const result = request.recordset[0];
    return result;
}