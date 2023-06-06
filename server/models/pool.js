const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

var pool = null;

const createInstance = async () => {
    try {
        pool = await sql.connect(sqlConfig);
    }
    catch {
        pool = null;
        throw new Error("Database connection fail");
    }
}

const closeInstance = async () => {
    if(pool !== null)
    {
        if(pool.connected){
            await pool.close();
        }
        pool = null;
    }
}

const getInstance = async () => {
    if(pool === null) {
        await createInstance();
    }
    if(!pool.connected) {
        await createInstance();
    }
    return pool;
}

module.exports = {
    getInstance,
    createInstance,
    closeInstance
}
