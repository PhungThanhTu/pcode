const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

exports.createCourseSql = async (id, title, subject, theme) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .input('title',sql.NVarChar,title)
        .input('courseSubject',sql.NVarChar,subject)
        .input('courseTheme',sql.NVarChar,theme)
        .execute('CreateCourse');

    await pool.close();
    return;
};

exports.getAllCourseSql = async (userId) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('userId',sql.UniqueIdentifier,userId)
        .query('exec GetAllCourses @userId');

    const result = request.recordset;

    pool.close();

    return result;
};

exports.getCourseByIdSql = async (courseId) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('courseId', sql.UniqueIdentifier, courseId)
        .query('exec GetCourseById @courseId');

    pool.close();

    const result = request.recordset[0];

    return result;
}

exports.renameCourseSql = async (courseId, title) => {

    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('courseId', sql.UniqueIdentifier, courseId)
        .input('newTitle', sql.NVarChar, title)
        .execute('RenameCourse');

    pool.close();

    return;
}

exports.getCourseTitleUsingInvitationCodeSql = async (code) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('code',sql.VarChar(5), code)
        .query('exec GetCourseUsingStudentInvitationCode @code');

    const result = request.recordset[0];

    return result;
}