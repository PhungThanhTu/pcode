const sql = require('mssql');
const { getInstance } = require('./pool');

exports.getProgrammingLanguageByIdSql = async (id) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('Id', sql.Int, id)
        .query('exec GetProgrammingLanguageById @Id');

    const result = request.recordset[0];

    return result;
}