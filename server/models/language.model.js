const { getInstance } = require('./pool');

module.exports.getProgrammingLanguagesSql = async () => {

    const pool = await getInstance();

    const request = await pool.request()
        .query('exec GetProgrammingLanguages');
    const result = request.recordset;

    return result;
}