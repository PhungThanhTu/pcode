var express = require('express');
var joi = require('joi');
const { randomUUID } = require('crypto');
const mime = require('mime-types');
const multer = require('multer');
const { maxFileSize } = require('../configs/blobConfig');
const { handleExceptionInResponse } = require('../exception');
const { uploadMedia, getMediaMetaDataSql, getMediaBlobStream, deleteMedia } = require('../models/media.model');
const { getFileExtensions } = require('../utils/media.utils');
var router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});

router.post('/', upload.single('file') , async (req, res) => {
    try {
        const file = req.file;
        if(!file) {
            return res.status(400).send("Must contain a file in request");
        }
        const id = randomUUID();
        const fileContent = file.buffer;
        const name = file.originalname;
        const download = req.body.download === '1' ? true : false;
        const fileSize = file.buffer.length;
        const fileSizeInMb = (fileSize / (1024 * 1024)).toFixed(2);
        const extension = getFileExtensions(name);
        const mimeType = mime.lookup(extension);

        if(download === undefined){
            return res.status(400).send("Must contain download flag");
        }

        if(fileSize > maxFileSize)
            return res.status(413).send(`File is too large to be uploaded, maximum 10MB, your file is ${fileSizeInMb} MB`);

        await uploadMedia(id, name, extension, mimeType, download, fileContent);

        return res.json({
            id,
            name,
            download,
            fileSize,
            extension,
            mimeType
        });         
    }
    catch (err) {
        return handleExceptionInResponse(res, err);
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await joi.string().uuid().validateAsync(id);

        const fileMeta = await getMediaMetaDataSql(id);

        if(!fileMeta)
        {
            return res.sendStatus(404);
        }

        const fileStream = await getMediaBlobStream(id);

        if(!fileStream)
        {
            return res.status(400).send("The file has been coruppted");
        }

        const download = fileMeta.Download;
        const contentType = fileMeta.MimeType;
        const fileName = fileMeta.MediaBlobName;

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Security-Policy', "frame-ancestors *");
        res.setHeader('Content-Disposition', `${download ? 'attachment' : 'inline'}; filename="${fileName}"`);

        fileStream.readableStreamBody.pipe(res);

    }
    catch (err) {
        return handleExceptionInResponse(res, err);
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await joi.string().uuid().validateAsync(id);

        const fileMeta = await getMediaMetaDataSql(id);

        if(!fileMeta)
        {
            return res.sendStatus(404);
        }

        await deleteMedia(id);

        return res.sendStatus(200);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

module.exports = router;