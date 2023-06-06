const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');
const { getInstance } = require('./pool');

exports.createCourseSql = async (id, title, subject, theme) => {
    const pool = await getInstance();

    await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .input('title',sql.NVarChar,title)
        .input('courseSubject',sql.NVarChar,subject)
        .input('courseTheme',sql.NVarChar,theme)
        .execute('CreateCourse');

    return;
};

exports.getAllCourseSql = async (userId) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('userId',sql.UniqueIdentifier,userId)
        .query('exec GetAllCourses @userId');

    const result = request.recordset;

    return result;
};

exports.getCourseByIdSql = async (courseId) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('courseId', sql.UniqueIdentifier, courseId)
        .query('exec GetCourseById @courseId');


    const result = request.recordset[0];

    return result;
}

exports.renameCourseSql = async (courseId, title) => {

    const pool = await getInstance();

    await pool.request()
        .input('courseId', sql.UniqueIdentifier, courseId)
        .input('newTitle', sql.NVarChar, title)
        .execute('RenameCourse');


    return;
}

exports.getCourseTitleUsingInvitationCodeSql = async (code) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('code',sql.VarChar(5), code)
        .query('exec GetCourseUsingStudentInvitationCode @code');

    const result = request.recordset[0];

    return result;
}

exports.getAllDocumentsInCourseSql = async (courseId) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('CourseId', sql.UniqueIdentifier, courseId)
        .query('exec GetAllDocumentsInCourse @CourseId');

        const result = request.recordset;

        return result;
}

exports.getPublishedDocumentInCourseSql = async (courseId) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('CourseId', sql.UniqueIdentifier, courseId)
        .query('exec GetPublishedDocumentsInCourse @CourseId');
    
        const result = request.recordset;

        return result;
}

exports.getRoleInCourseSql = async (courseId, identity) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('courseId', sql.UniqueIdentifier, courseId)
        .input('userId', sql.UniqueIdentifier, identity)
        .query('exec GetRoleOfAUserInCourse @userId, @courseId');

    const result = request.recordset[0];

    return result;
}