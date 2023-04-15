require('dotenv').config();

module.exports = {
    conString: process.env.AZURE_BLOB_CONSTRING,
    containerName: "plpcontainer"
}
