const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

exports.getSubmissionByIdSql = async (id) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .query('exec GetSubmissionById @Id');

    await pool.close();

    const result = request.recordset[0];

    return result;
}