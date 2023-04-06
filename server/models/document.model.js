const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

exports.createDocumentSql = async (id, title, description, creatorId, hasExercise) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .input('Title', sql.NVarChar(320),title)
        .input('Description', sql.NVarChar(640), description)
        .input('CreatorId', sql.UniqueIdentifier, creatorId)
        .input('HasExercise', sql.Bit, hasExercise)
        .execute('CreateDocument');

    await pool.close();
    return;
};

exports.linkDocumentWithCourseSql = async (documentId, courseId) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('CourseId', sql.UniqueIdentifier, courseId)
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .execute('LinkDocumentWithCourse');

    await pool.close();
    return;
}

exports.setDocumentPublicitySql = async (documentId, courseId, publicity) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('CourseId', sql.UniqueIdentifier, courseId)
        .input('DocumentId', sql.UniqueIdentifier, documentId)
        .input('Publicity', sql.Bit, publicity)
        .execute('SetDocumentPublicity');

    await pool.close();
    return;
}