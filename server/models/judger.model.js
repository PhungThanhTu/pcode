const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

module.exports.getAllJudgersSql = async () => {

    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .query('GetAllJudgers');
    
    await pool.close();

    const result = request.recordset;

    return result;
}
