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

exports.getStudentSubmissionWithScoreInDocumentSql = async (documentId) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .query('exec GetStudentSubmissionWithScoreInDocument @DocumentId')
    
    await pool.close();

    const result = request.recordset;

    return result;
}

exports.getStudentScoreInCourseSql = async (courseId) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('CourseId', sql.UniqueIdentifier, courseId)
        .query('exec GetStudentScoreInCourse @CourseId');
    
    await pool.close();

    const result = request.recordset;

    return result;
}