const { BlobServiceClient } = require('@azure/storage-blob');
const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

const loadMediaMetadataToDatabase = async (id, fileName, extension, mime, download, size) => {
    const pool = await sql.connect(sqlConfig);

    await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .input('MediaBlobName', sql.NVarChar(50), fileName)
        .input('Extension', sql.NVarChar(20), extension)
        .input('MimeType', sql.NVarChar(40), mime)
        .input('Download', sql.Bit, download)
        .input('FileSize', sql.Float, size)
        .execute('CreateMedia');

    await pool.close();
    return;
}

const loadMediaToStorageBlob = async () => {
    
}

module.exports.uploadMedia = async (id, fileName, extension, mime, download, size) => {

}

module.exports.getMedia = async (id) => {

}

module.exports.deleteMedia = async (id) => {
    
}