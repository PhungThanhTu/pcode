module.exports = {
    getFileExtensions: (fileName) => {
        return fileName.split('.').pop();
    }
}