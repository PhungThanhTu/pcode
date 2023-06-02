const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');
const { getInstance } = require('./pool');

exports.createExerciseInDocumentSql = async (
    id,
    documentId,
    runtimeLimit,
    memoryLimit,
    scoreWeight,
    manualPercentage,
    judgerId
    ) => {
    const pool = await getInstance();

    await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('RuntimeLimit', sql.Int, runtimeLimit)
        .input('MemoryLimit', sql.Int, memoryLimit)
        .input('ScoreWeight', sql.Int, scoreWeight)
        .input('ManualPercentage', sql.Float, manualPercentage)
        .input('JudgerId', sql.UniqueIdentifier, judgerId)
        .execute('CreateExerciseInDocument')

}

exports.updateExerciseInDocumentSql = async (
    documentId,
    runtimeLimit,
    memoryLimit,
    scoreWeight,
    manualPercentage,
    haveDeadline,
    deadline,
    strictDeadline,
    judgerId
) => {

    const pool = await getInstance();

    await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('RuntimeLimit', sql.Int, runtimeLimit)
        .input('MemoryLimit', sql.Int, memoryLimit)
        .input('ScoreWeight', sql.Int, scoreWeight)
        .input('ManualPercentage', sql.Float, manualPercentage)
        .input('HaveDeadline', sql.Bit, haveDeadline)
        .input('Deadline', sql.DateTime2, deadline)
        .input('StrictDeadline', sql.Bit, strictDeadline)
        .input('JudgerId', sql.UniqueIdentifier, judgerId)
        .execute('UpdateExerciseByDocumentId');

}

exports.getExerciseInDocumentSql = async (
    documentId
) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .query('exec GetExerciseByDocumentId @DocumentId');

    const result = request.recordset[0];
    return result;
}

exports.mergeSampleSourceCodeInDocumentSql = async (
    documentId, 
    programmingLanguageId, 
    sourceCode) => {
    const pool = await getInstance();

    await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('ProgrammingLanguageId', sql.Int, programmingLanguageId)
        .input('SourceCode', sql.NVarChar, sourceCode)
        .execute('MergeSampleSourceCodeByDocumentId');

    return;
}

exports.getSampleSourceCodeInDocumentSql = async (
    documentId,
    programmingLanguageId
) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('ProgrammingLanguageId', sql.Int, programmingLanguageId)
        .query('exec GetSampleSourceCodeByDocumentId @DocumentId, @ProgrammingLanguageId');

    const result = request.recordset[0];
    return result;
}