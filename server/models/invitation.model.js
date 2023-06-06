const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');
const { getInstance } = require('./pool');

exports.createInvitationSql = async (courseId, plpRoleId, code) => {
    const pool = await getInstance();

    await pool.request()
        .input('courseId', sql.UniqueIdentifier, courseId)
        .input('plpRoleId',sql.Int,plpRoleId)
        .input('code',sql.VarChar(5), code)
        .execute('CreateInvitation');
    return;
};

exports.getInvitationSql = async (code) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('code', sql.VarChar(5), code)
        .query('exec GetCourseIdByInvitationCode @code');

    
    return result;
} 