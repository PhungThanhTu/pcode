const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

module.exports.createContentSql = async (id, contentTypeId, documentId, contentBody) => {

    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('Id',sql.UniqueIdentifier, id)
        .input('ContentTypeId', sql.Int, contentTypeId)
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('ContentBody', sql.NVarChar, contentBody)
        .execute('CreateContent')
    
    await pool.close();

    return;
}

module.exports.getContentByIdSql = async (id) => {

    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .query('exec GetContentById @Id');
    
    await pool.close();

    const result = request.recordset[0];

    return result;
}

module.exports.deleteContentSql = async (id) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .execute('DeleteContent')
    
    await pool.close();

    return ;
}

module.exports.getContentsByDocumentIdSql = async (id) => {

    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .query('exec GetContentsByDocumentId @Id');
    
    await pool.close();

    const result = request.recordset;

    return result;
}

module.exports.updateContentByIdSql = async (id, content) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .input('ContentBody', sql.NVarChar, content)
        .execute('UpdateContentById')
    
    await pool.close();

    return ;
}

module.exports.getContentTypesSql = async () => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .query('exec GetContentTypes');
    
    await pool.close();

    const result = request.recordset;

    return result;
}