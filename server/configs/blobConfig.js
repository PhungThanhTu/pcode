require('dotenv').config();

module.exports = {
    conString: process.env.AZURE_BLOB_CONSTRING,
    containerName: "plpcontainer",
    maxFileSize: 10 * 1024 * 1024
}
