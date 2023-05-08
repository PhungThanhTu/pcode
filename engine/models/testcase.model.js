const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

exports.getTestCaseBySubmissionIdSql = async (submissionId) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('SubmissionId', sql.UniqueIdentifier, submissionId)
        .query('exec GetTestCasesBySubmissionId  @SubmissionId');

    await pool.close();

    const result = request.recordset;

    return result;
}