const sql = require('mssql');
const { getInstance } = require('./pool');

exports.getTestCaseBySubmissionIdSql = async (submissionId) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('SubmissionId', sql.UniqueIdentifier, submissionId)
        .query('exec GetTestCasesBySubmissionId  @SubmissionId');

    const result = request.recordset;

    return result;
}