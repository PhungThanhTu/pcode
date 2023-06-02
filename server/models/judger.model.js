const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');
const { getInstance } = require('./pool');

module.exports.getAllJudgersSql = async () => {

    const pool = await getInstance();

    const request = await pool.request()
        .query('GetAllJudgers');

    const result = request.recordset;

    return result;
}
