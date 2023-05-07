const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

exports.getExerciseByIdSql = async (id) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .query('exec GetExerciseById @Id');
    
    await pool.close();

    const result = request.recordset[0];

    return result;
}