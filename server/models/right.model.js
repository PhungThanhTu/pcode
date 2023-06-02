const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');
const { getInstance } = require('./pool');

exports.grantRoleToCourseSql = async (userId, courseId, plpRoleId) => {
    const pool = await getInstance();

    await pool.request()
        .input('userId', sql.UniqueIdentifier, userId)
        .input('courseId',sql.UniqueIdentifier, courseId)
        .input('plpRole',sql.Int, plpRoleId)
        .execute('GrantUserRoleToCourse');
        
    return;
};

exports.getRoleOfCourseSql = async (userId, courseId) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('userId', sql.UniqueIdentifier, userId)
        .input('courseId',sql.UniqueIdentifier, courseId)
        .query('exec GetRoleOfAUserInCourse @userId, @courseId');
    const result = request.recordset;
    return result[0];
}