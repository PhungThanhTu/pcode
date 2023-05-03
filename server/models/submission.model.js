const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

exports.createSubmissionInDocumentSql = async (
    id,
    documentId,
    userId,
    programmingLanguageId,
    sourceCode
) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('UserId', sql.UniqueIdentifier, userId)
        .input('ProgrammingLanguageId', sql.Int, programmingLanguageId)
        .input('SourceCode', sql.NVarChar, sourceCode)
        .execute('CreateSubmissionInDocument');
    
    await pool.close();
}

exports.getProgrammingLanguagesSql = async () => {
    return Promise.resolve([
        1,
        2
    ])
}