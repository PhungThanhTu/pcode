const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');
const { getInstance } = require('./pool');

exports.createDocumentSql = async (id, title, description, creatorId, hasExercise) => {
    const pool = await getInstance();

    await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .input('Title', sql.NVarChar(320),title)
        .input('Description', sql.NVarChar(640), description)
        .input('CreatorId', sql.UniqueIdentifier, creatorId)
        .input('HasExercise', sql.Bit, hasExercise)
        .execute('CreateDocument');

    return;
};

exports.linkDocumentWithCourseSql = async (documentId, courseId) => {
    const pool = await getInstance();

    await pool.request()
        .input('CourseId', sql.UniqueIdentifier, courseId)
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .execute('LinkDocumentWithCourse');

    return;
}

exports.setDocumentPublicitySql = async (documentId, courseId, publicity) => {
    const pool = await getInstance();

    await pool.request()
        .input('CourseId', sql.UniqueIdentifier, courseId)
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('Publicity', sql.Bit, publicity)
        .execute('SetDocumentPublicity');
    return;
}

exports.setDocumentPublicityAllCourseSql = async (documentId, publicity) => {
    const pool = await getInstance();

    await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('Publicity', sql.Bit, publicity)
        .execute('SetDocumentPublicityAllCourse');

    return;
}

exports.getDocumentContentTypes = async () => {
    const pool = await getInstance();

    const request = await pool.request()
        .query('exec GetContentTypes');

    const result = request.recordset;

    return result;
}

exports.getDocumentByIdSql = async (id) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .query('exec GetDocumentById @Id');

    const result = request.recordset[0];

    return result;
}

exports.deleteDocumentSql = async (id) => {
    const pool = await getInstance();

    await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .execute('DeleteDocument');

    return;
}

exports.getRoleDocumentSql = async (documentId, userId) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('UserId', sql.UniqueIdentifier, userId)
        .query('exec GetRoleOnDocument @DocumentId, @UserId');
    
    const result = request.recordset;

    return result;
}

exports.updateDocumentSql = async (id, title, description) => {
    const pool = await getInstance();

    await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .input('Title', sql.NVarChar(320), title)
        .input('DocumentDescription', sql.NVarChar(640), description)
        .execute('UpdateDocument');

    return;
}

exports.deleteUnmarkedSubmissionInDocumentSql = async (documentId) => {
    const pool = await getInstance();

    await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .execute('DeleteUnmarkedSubmissionInDocument');
    
    return;
}

exports.getFirstExerciseByDocumentIdSql = async (documentId) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .query('exec GetFirstExerciseByDocumentId @DocumentId');
    
    const result = request.recordset[0];
    
    return result;
}