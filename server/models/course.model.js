const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

exports.createCourseSql = async (id, title) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .input('title',sql.NVarChar,title)
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