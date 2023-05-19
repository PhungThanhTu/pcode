const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

exports.scoreSubmissionManuallySql = async (submissionId, score) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('SubmissionId', sql.UniqueIdentifier, submissionId)
        .input('Score', sql.Float, score)
        .execute('ScoreSubmissionManually');

    await pool.close();
}