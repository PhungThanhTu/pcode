const sql = require('mssql');
const { getInstance } = require('./pool');

exports.getExerciseByIdSql = async (id) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .query('exec GetExerciseById @Id');
    
    const result = request.recordset[0];

    return result;
}