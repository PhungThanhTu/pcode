const sql = require('mssql');
const fs = require('fs/promises');
const path = require('path');

require('dotenv').config();

const conString = process.env.MSSQL_CONSTRING;
const dirname = __dirname;
const desiredDir = path.dirname(dirname);
const setupDir = path.join(desiredDir, 'setup');


const tryConnect = async (conString) => {
        try {
            await sql.connect(conString)
            console.log("connected");
            return true;
        } catch (err) {
            console.log("Connect failed, Waiting for the db to setup ...");
            return false;
        }
}


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const execQuery = async (query) => {
    try
    {
        const pool = await sql.connect(conString);

        await pool.request()
        .query(query);
        await pool.close();
        return;
    }
    catch (err)
    {
        console.log(err);
    }
}

const getSqlPaths = async () => {
    const listPaths = await fs.readdir('../setup');
    console.log(listPaths);
    return listPaths;
};

const getSqlQueryFromFile = async (path) => {
    const buffer = await fs.readFile(path);
    const query = buffer.toString();
    console.log(query);
    return query;
}

const execSingleFile = async (path) => {
    const query = await getSqlQueryFromFile(`${setupDir}/${path}`);
    console.log('\x1b[32m%s\x1b[0m',`File ${path} is being executed -----------`);
    await execQuery(query);
    console.log('\x1b[33m%s\x1b[0m',`File ${path} has been executed successfully`);
}

const applyQuery = async () => {
    const paths = await getSqlPaths();
    
        for(const path of paths){
            await execSingleFile(path);
        }
}

var queryAppliedFlag = false;

var numCon = 0;

const sqlInit = async () => {

    while(!queryAppliedFlag && numCon < 10)
    {
        await timeout(3000);
        queryAppliedFlag = await tryConnect(conString);
        
        if(queryAppliedFlag)
        {
            await applyQuery();
        }
    }
    if(numCon >= 10)
    {
        console.log("Migration failed, please reset the process by using the command :");
        console.log('\x1b[32m%s\x1b[0m',`docker exec -it mssql node setup.js`);
        console.log("If the command above failed, try rerun the whole startup by run these commands: ");
        console.log('\x1b[32m%s\x1b[0m',`[for mac and linux]: source teardown.sh && source startup.sh`);
        console.log('\x1b[32m%s\x1b[0m',`[for windows]: .\\teardown.bat`);
        console.log('\x1b[32m%s\x1b[0m',`[for windows]: .\\startup.bat`);
    }
    else {
        console.log("Migration completed successfully, your application is ready to go");
    }
}
console.log("Applying database migration process, please wait until it completed, ...")
setTimeout(sqlInit, 5000);


