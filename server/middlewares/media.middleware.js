const multer = require('multer');
const { maxFileSize } = require('../configs/blobConfig');

const upload = multer({
    storage: multer.memoryStorage()
});

const verifySingleFile = async (req, res, next) => {
    if(req.body.contentTypeId === "0")
    {
        // don't handle file for markdown
        next();
    }
    const file = req.file;
        if(!file) {
            return res.status(400).send("Must contain a file in request");
        }

        const fileSize = file.buffer.length;
        const fileSizeInMb = (fileSize / (1024 * 1024)).toFixed(2);

        if(fileSize > maxFileSize)
            return res.status(413).send(`File is too large to be uploaded, maximum 10MB, your file is ${fileSizeInMb} MB`);

        next();
}

module.exports.uploadSingleFile = async (req, res, next) => {
    upload.single('file')(req, res, () => {
        verifySingleFile(req, res, next);
    });
}