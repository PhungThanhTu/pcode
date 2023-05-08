module.exports = {
    error: (log) => {
        console.log('\x1b[31m%s\x1b[0m', log)
    },
    info: (log) => {
        console.log('\x1b[37m%s\x1b[0m', log)
    },
    warn: (log) => {
        console.log('\x1b[33m%s\x1b[0m', log)
    },
    success: (log) => {
        console.log('\x1b[32m%s\x1b[0m', log)
    }
}