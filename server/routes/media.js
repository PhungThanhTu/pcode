var express = require('express');
const { randomUUID } = require('crypto');
const mime = require('mime-types');
const multer = require('multer');
const { maxFileSize } = require('../configs/blobConfig');
const { handleExceptionInResponse } = require('../exception');
const { uploadMedia } = require('../models/media.model');
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
        const download = req.body.download;
        const fileSize = file.buffer.length;
        const fileSizeInMb = (fileSize / (1024 * 1024)).toFixed(2);
        const extension = getFileExtensions(name);
        const mimeType = mime.lookup(extension);

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

module.exports = router;