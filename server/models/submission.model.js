const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');
const { getInstance } = require('./pool');

exports.createSubmissionInDocumentSql = async (
    id,
    documentId,
    userId,
    programmingLanguageId,
    sourceCode
) => {
    const pool = await getInstance();

    await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('UserId', sql.UniqueIdentifier, userId)
        .input('ProgrammingLanguageId', sql.Int, programmingLanguageId)
        .input('SourceCode', sql.NVarChar, sourceCode)
        .execute('CreateSubmissionInDocument');
}

exports.getProgrammingLanguagesSql = async () => {
    const pool = await getInstance();

    const request = await pool.request()
        .query('exec GetProgrammingLanguages');

    const result = request.recordset.map(e => e.Id);

    return result;
}

exports.getMySubmissionInDocumentSql = async (
    documentId,
    userId
) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('UserId', sql.UniqueIdentifier, userId)
        .query('exec GetMySubmissionsInDocument @DocumentId, @UserId');

    const result = request.recordset;

    return result;
}

exports.checkOwnerSubmissionSql = async (
    submissionId,
    userId
) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('UserId', sql.UniqueIdentifier, userId)
        .input('SubmissionId', sql.UniqueIdentifier, submissionId)
        .query('exec CheckOwnerSubmission @UserId, @SubmissionId')
    
    
    const result = request.recordset[0];

    if(!result)
        return 0

    return result.IsOwner;
}

exports.markSubmissionSql = async (submissionId) => {
    const pool = await getInstance();

    await pool.request()
        .input('Id', sql.UniqueIdentifier, submissionId)
        .execute('MarkSubmission');

}

exports.getSingleSubmissionSql = async (submissionId) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('SubmissionId', sql.UniqueIdentifier, submissionId)
        .query('exec GetSingleSubmission @SubmissionId')

    const result = request.recordset[0];

    return result;
}

exports.deleteSubmissionByIdSql = async (submissionId) => {
    const pool = await getInstance();

    await pool.request()
        .input('SubmissionId', sql.UniqueIdentifier, submissionId)
        .execute('DeleteSubmissionById');
}

exports.getStudentMarkedSubmissionsInDocumentSql = async (documentId) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .query('exec GetStudentMarkedSubmissionsInDocument @DocumentId');
    const result = request.recordset;

    return result;
}

exports.getTestResultBySubmissionIdSql = async (submissionId) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('SubmissionId', sql.UniqueIdentifier, submissionId)
        .query('exec GetTestResultsBySubmissionId @SubmissionId');

    const result = request.recordset;

    return result;
}