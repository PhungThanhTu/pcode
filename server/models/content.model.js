const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');
const { getInstance } = require('./pool');

module.exports.createContentSql = async (id, contentTypeId, documentId, contentBody) => {

    const pool = await getInstance();

    await pool.request()
        .input('Id',sql.UniqueIdentifier, id)
        .input('ContentTypeId', sql.Int, contentTypeId)
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('ContentBody', sql.NVarChar, contentBody)
        .execute('CreateContent')

    return;
}

module.exports.getContentByIdSql = async (id) => {

    const pool = await getInstance();

    const request = await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .query('exec GetContentById @Id');

    const result = request.recordset[0];

    return result;
}

module.exports.deleteContentSql = async (id) => {
    const pool = await getInstance();

    await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .execute('DeleteContent')
    
    return;
}

module.exports.getContentsByDocumentIdSql = async (id) => {

    const pool = await getInstance();

    const request = await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .query('exec GetContentsByDocumentId @Id');
    

    const result = request.recordset;

    return result;
}

module.exports.updateContentByIdSql = async (id, content) => {
    const pool = await getInstance();

    await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .input('ContentBody', sql.NVarChar, content)
        .execute('UpdateContentById')
    

    return ;
}

module.exports.getContentTypesSql = async () => {
    const pool = await getInstance();

    const request = await pool.request()
        .query('exec GetContentTypes');
    

    const result = request.recordset;

    return result;
}