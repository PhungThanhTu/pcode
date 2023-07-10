const sql = require('mssql');
const { getInstance } = require('./pool');

module.exports.getAdminUserSql = async (id) => {
    const pool = await getInstance();
    const request = await pool.request()
        .input('UserId',sql.UniqueIdentifier, id)
        .query('exec GetAdminUser @UserId')

      const result = request.recordset;
      return result[0];
}

module.exports.getAllUsersSql = async () => {
  const pool = await getInstance();
    const request = await pool.request()
        .query('exec GetAllUsers')

      const result = request.recordset;
      return result;
}

module.exports.setUserStatusSql = async (id, status) => {
  const pool = await getInstance();
    await pool.request()
        .input('UserId', sql.UniqueIdentifier, id)
        .input('UserStatus', sql.Int, status)
        .execute("SetUserStatus");

    return;
}