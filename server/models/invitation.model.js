const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

exports.createInvitationSql = async (courseId, plpRoleId, code) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('courseId', sql.UniqueIdentifier, courseId)
        .input('plpRoleId',sql.Int,plpRoleId)
        .input('code',sql.VarChar(5), code)
        .execute('CreateInvitation');

    await pool.close();
    return;
};