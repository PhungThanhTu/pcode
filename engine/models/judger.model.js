const sql = require('mssql');
const { getInstance } = require('./pool');

exports.getJudgerByIdSql = async (id) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .query('exec GetJudgerById @Id');

    const result = request.recordset[0];

    return result;
}