const sql = require('mssql');
const fs = require('fs/promises')

const config = {
    server : "localhost",
    port : 1433,
    user : "sa",
    password: process.env.SA_PASSWORD,
    database: process.env.DATABASE,
    options: {
        encrypt: false, // use encryption for data sent across the network// trust the server's SSL certificate
        useUTC: true
      }
}

const tryConnect = async () => {
        try {
            await sql.connect(config)
            console.log("connected");
        } catch (err) {
            console.log(err);
        }
}

const createDatabase = async () => {
    try
    {
        const pool = await sql.connect(config);

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

const execQuery = async (query) => {
    try
    {
        const pool = await sql.connect(config);

        await pool.request()
        .query(query);
        console.log(`Database ${config.database} created`);
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
            const query = await getSqlQueryFromFile(`/setup/${path}`);
            console.log('\x1b[32m%s\x1b[0m',`File ${path} is being executed -----------`);
            console.log('\x1b[33m%s\x1b[0m',query);
            await execQuery(query);
            console.log('\x1b[33m%s\x1b[0m','Success')
        }
    }
    catch (err)
    {
        throw err;
    }
   
}

startSQLInitialization();