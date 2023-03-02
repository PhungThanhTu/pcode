const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

exports.grantRoleToCourseSql = async (userId, courseId, plpRole) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('userId', sql.UniqueIdentifier, userId)
        .input('courseId',sql.UniqueIdentifier, courseId)
        .input('plpRole',sql.VarChar(10), plpRole)
        .execute('GrantUserRoleToCourse');
        
    await pool.close();
    return;
};