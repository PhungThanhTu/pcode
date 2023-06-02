const { BlobServiceClient } = require('@azure/storage-blob');
const sql = require('mssql');
const { conString, containerName } = require('../configs/blobConfig');
const sqlConfig = require('../configs/mssqlConfig');
const { getInstance } = require('./pool');

const createMediaSql = async (
    id, 
    fileName, 
    extension, 
    mime, 
    download, 
    size) => 
{
    const pool = await getInstance();

    await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .input('MediaBlobName', sql.NVarChar(50), fileName)
        .input('Extension', sql.NVarChar(20), extension)
        .input('MimeType', sql.NVarChar(40), mime)
        .input('Download', sql.Bit, download)
        .input('FileSize', sql.Float, size)
        .execute('CreateMedia');

    return;
}

const deleteMediaSql = async (id) => {
    const pool = await getInstance();

    await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .execute('DeleteMedia');

    return;
}

const deleteMediaBlob = async (id) => {
    try {
        const blobName = id;
        const blobClient = BlobServiceClient
            .fromConnectionString(conString);

        const containerClient = blobClient
            .getContainerClient(containerName);

        await containerClient.createIfNotExists();

        const singleBlobClient = containerClient
            .getBlockBlobClient(blobName);

        await singleBlobClient.delete();

    }
    catch (err)
    {
        console.log(`Delete media from blob storage failed due to the error ${err}`)
        throw err;
    }
}

const createMediaBlob = async (id, fileContent, size) => {
    try {
        const blobName = id;
        const blobClient = BlobServiceClient
            .fromConnectionString(conString);

        const containerClient = blobClient
            .getContainerClient(containerName);

        await containerClient.createIfNotExists();

        const singleBlobClient = containerClient
            .getBlockBlobClient(blobName);

        await singleBlobClient.upload(fileContent, size);

        return id;
    }
    catch (err)
    {
        console.log(`Upload to blob storage failed due to the error ${err}`)
        throw err;
    }
}

module.exports.uploadMedia = async (
    id, 
    fileName, 
    extension, 
    mime, 
    download, 
    fileContent) => 
{
    const size = fileContent.length;

    await createMediaBlob(id, fileContent, size);
    await createMediaSql(
        id, 
        fileName, 
        extension, 
        mime, 
        download, 
        size);
}

module.exports.getMediaMetaDataSql = async (id) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('Id', sql.UniqueIdentifier, id)
        .query('exec GetMediaData @Id');

    const result = request.recordset[0];
    
    return result;
}

module.exports.getMediaBlobStream = async (id) => {
    const blobName = id;

    const blobClient = BlobServiceClient
        .fromConnectionString(conString);

    if(!blobClient)
        throw new Error("Azure Blob storage is not available");
    
    const containerClient = blobClient
        .getContainerClient(containerName);
    const singleBlobClient = containerClient
        .getBlockBlobClient(blobName);

    const blobStream = 
        await singleBlobClient
        .download();
    
    return blobStream;
}

module.exports.deleteMedia = async (id) => {
    await deleteMediaSql(id);
    await deleteMediaBlob(id);
}