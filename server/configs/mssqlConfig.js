require('dotenv').config();

module.exports = {
    server : process.env.MSSQL_HOST,
    port : Number(process.env.MSSQL_PORT),
    user : process.env.MSSQL_USERNAME,
    password: process.env.MSSQL_PASSWORD,
    database: process.env.MSSQL_DATABASE,
    options: {
        encrypt: false,
        useUTC: true,
      }
}