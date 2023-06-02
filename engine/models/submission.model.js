const sql = require('mssql');
const { getInstance } = require('./pool');

exports.getSubmissionByIdSql = async (id) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .query('exec GetSubmissionById @Id');

    const result = request.recordset[0];

    return result;
}

exports.updateSubmissionTestResultSql = async (submissionId, jsonJudgeData) => {
    const pool = await getInstance();

     await pool.request()
        .input('submissionId', sql.UniqueIdentifier, submissionId)
        .input('jsonJudgeData', sql.NVarChar, jsonJudgeData)
        .execute('UpdateSubmissionResult')
}

exports.markSubmissionAsFinishedSql = async (submissionId) => {
    const pool = await getInstance();

     await pool.request()
        .input('SubmissionId', sql.UniqueIdentifier, submissionId)
        .execute('MarkSubmissionAsFinished');
}