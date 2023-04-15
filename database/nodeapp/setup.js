const sql = require('mssql');
const fs = require('fs/promises')

const masterDbConfig = {
    server : "localhost",
    port : 1433,
    user : "sa",
    password: process.env.MSSQL_SA_PASSWORD,
    database: "master",
    options: {
        encrypt: false, // use encryption for data sent across the network// trust the server's SSL certificate
        useUTC: true
      }
}


const config = {
    server : "localhost",
    port : 1433,
    user : "sa",
    password: process.env.MSSQL_SA_PASSWORD,
    database: process.env.DATABASE,
    options: {
        encrypt: false, // use encryption for data sent across the network// trust the server's SSL certificate
        useUTC: true
      }
}

const tryConnect = async (dbConfig) => {
        try {
            await sql.connect(dbConfig)
            console.log("connected");
            return true;
        } catch (err) {
            console.log("Connect failed, Waiting for the db to setup ...");
            return false;
        }
}

const createDatabase = async () => {
    try
    {
        const pool = await sql.connect(masterDbConfig);

        await pool.request()
        .query(`CREATE DATABASE ${config.database}`);
        console.log(`Database ${config.database} created`);
        await pool.close();
        return;
    }
    catch (err)
    {
        console.log(err);
    }
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const execQuery = async (query) => {
    try
    {
        const pool = await sql.connect(config);

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
    const listPaths = await fs.readdir('/setup');
    console.log(listPaths);
    return listPaths;
};

const getSqlQueryFromFile = async (path) => {
    const buffer = await fs.readFile(path);
    const query = buffer.toString();
    console.log(query);
    return query;
}

const startSQLInitialization = async () => {
    try {
        await createDatabase();

        const paths = await getSqlPaths();
    
        for(const path of paths){
            await execSingleFile(path);
        }
    }
    catch (err)
    {
        throw err;
    }
   
}

const execSingleFile = async (path) => {
    const query = await getSqlQueryFromFile(`/setup/${path}`);
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

var dbCreatedFlag = false;
var queryAppliedFlag = false;

var numCon = 0;

const sqlInit = async () => {
    while(!dbCreatedFlag && numCon < 10)
    {
        await timeout(3000);
        dbCreatedFlag = await tryConnect(masterDbConfig);

        if(dbCreatedFlag){
            await createDatabase();
        }

    }

    while(!queryAppliedFlag && numCon < 10)
    {
        await timeout(3000);
        queryAppliedFlag = await tryConnect(config);
        
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