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