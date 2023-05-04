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

exports.getMySubmissionInDocumentSql = async (
    documentId,
    userId
) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('UserId', sql.UniqueIdentifier, userId)
        .query('exec GetMySubmissionsInDocument @DocumentId, @UserId');
    
    await pool.close();

    const result = request.recordset;

    return result;
}

exports.checkOwnerSubmissionSql = async (
    submissionId,
    userId
) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('UserId', sql.UniqueIdentifier, userId)
        .input('SubmissionId', sql.UniqueIdentifier, submissionId)
        .query('exec CheckOwnerSubmission @UserId, @SubmissionId')
    
    await pool.close();
    
    const result = request.recordset[0];

    if(!result)
        return 0

    return result.IsOwner;
}

exports.markSubmissionSql = async (submissionId) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('Id', sql.UniqueIdentifier, submissionId)
        .execute('MarkSubmission');

    await pool.close();
}

exports.getSingleSubmissionSql = async (submissionId) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('SubmissionId', sql.UniqueIdentifier, submissionId)
        .query('exec GetSingleSubmission @SubmissionId')
    
    await pool.close();

    const result = request.recordset[0];

    return result;
}

exports.deleteSubmissionByIdSql = async (submissionId) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('SubmissionId', sql.UniqueIdentifier, submissionId)
        .execute('DeleteSubmissionById');
    await pool.close();
}

exports.getStudentMarkedSubmissionsInDocumentSql = async (documentId) => {
    const pool = await sql.connect(sqlConfig);

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .query('exec GetStudentMarkedSubmissionsInDocument @DocumentId');
    
    await pool.close();

    const result = request.recordset;

    return result;
}