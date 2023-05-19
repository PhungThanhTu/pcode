const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

exports.getSubmissionByIdSql = async (id) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .query('exec GetSubmissionById @Id');

    await pool.close();

    const result = request.recordset[0];

    return result;
}

exports.updateSubmissionTestResultSql = async (submissionId, jsonJudgeData) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('submissionId', sql.UniqueIdentifier, submissionId)
        .input('jsonJudgeData', sql.NVarChar, jsonJudgeData)
        .execute('UpdateSubmissionResult')

    await pool.close();
}

exports.markSubmissionAsFinishedSql = async (submissionId) => {
    const pool = await sql.connect(sqlConfig);

     await pool.request()
        .input('SubmissionId', sql.UniqueIdentifier, submissionId)
        .execute('MarkSubmissionAsFinished');

    await pool.close();
}