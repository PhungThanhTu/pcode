const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

exports.grantRoleToCourseSql = async (userId, courseId, plpRoleId) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('userId', sql.UniqueIdentifier, userId)
        .input('courseId',sql.UniqueIdentifier, courseId)
        .input('plpRole',sql.Int, plpRoleId)
        .execute('GrantUserRoleToCourse');
        
    await pool.close();
    return;
};

exports.getRoleOfCourseSql = async (userId, courseId) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('userId', sql.UniqueIdentifier, userId)
        .input('courseId',sql.UniqueIdentifier, courseId)
        .query('exec GetRoleOfAUserInCourse @userId, @courseId');
    const result = request.recordset;
    await pool.close();
    return result[0];
}