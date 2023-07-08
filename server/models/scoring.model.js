const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');
const { getInstance } = require('./pool');

exports.scoreSubmissionManuallySql = async (submissionId, score) => {
    const pool = await getInstance();

    await pool.request()
        .input('SubmissionId', sql.UniqueIdentifier, submissionId)
        .input('Score', sql.Float, score)
        .execute('ScoreSubmissionManually');
}

exports.getStudentSubmissionWithScoreInDocumentSql = async (documentId) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .query('exec GetStudentSubmissionWithScoreInDocument @DocumentId')
    

    const result = request.recordset;

    return result;
}

exports.getStudentScoreInCourseSql = async (courseId) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('CourseId', sql.UniqueIdentifier, courseId)
        .query('exec GetStudentScoreInCourse @CourseId');

    const result = request.recordset;

    return result;
}

exports.getAllDetailScoreInCourseSql = async (courseId) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('CourseId', sql.UniqueIdentifier, courseId)
        .query('exec GetAllDetailScoreInCourse @CourseId');

    const result = request.recordset;

    return result;
}