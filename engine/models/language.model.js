const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

exports.getProgrammingLanguageByIdSql = async (id) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('Id', sql.Int, id)
        .query('exec GetProgrammingLanguageById @Id');
    
    await pool.close();

    const result = request.recordset[0];

    return result;
}