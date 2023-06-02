const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

var pool = null;

const createInstance = async () => {
    pool = await sql.connect(sqlConfig);
}

const closeInstance = async () => {
    await pool.close();
    pool = null;
}

const getInstance = async () => {
    if(!pool) {
        await createInstance();
    }
    return pool;
}

module.exports = {
    getInstance,
    createInstance,
    closeInstance
}
