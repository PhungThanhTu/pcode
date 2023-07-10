const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');
const { getInstance } = require('./pool');

exports.registerUser = async (id,username, hashedPassword, fullname, email) => {
    
        const pool = await getInstance();
        await pool.request()
            .input('id',sql.UniqueIdentifier,id)
            .input('username',sql.VarChar(20),username)
            .input('email',sql.VarChar,email)
            .input('hashedPassword',sql.VarChar,hashedPassword)
            .input('fullName',sql.NVarChar,fullname)
            .execute('RegisterPlpUser');

        return;
}

exports.getUserByUsername = async (username) => {
    const pool = await getInstance();
    const request = await pool.request()
        .input('username',sql.VarChar(20),username)
        .query("exec GetUserByUsername @username");
    
    const result = request.recordset;

    return result[0];
}

exports.getUserById = async (identity) => {
    const pool = await getInstance();
    const request = await pool.request()
        .input('id',sql.UniqueIdentifier,identity)
        .query("exec GetUserById @id");
    
    const result = request.recordset;

    return result[0];
}

exports.updateRefreshToken = async (id, refreshToken, expiryDate) => {
    const pool = await getInstance();
    await pool.request()
        .input('id',sql.UniqueIdentifier,id)
        .input('refreshToken',sql.VarChar,refreshToken)
        .input('expiryDate',sql.DateTime,expiryDate)
        .execute("UpdateRefreshToken");

    return;   
}

exports.updateProfile = async (id, fullName, email, avatar) => {
    const pool = await getInstance();
    await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .input('fullName', sql.NVarChar, fullName)
        .input('email', sql.VarChar, email)
        .input('avatar',sql.NVarChar,avatar)
        .execute("UpdateProfile");

    return;
}

exports.changePassword = async (id, hashedPassword) => {
    const pool = await getInstance();
    await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .input('hashedPassword', sql.NVarChar, hashedPassword)
        .execute("ChangePassword");

    return;
}

exports.getUserStatusSql = async (id) => {
    const pool = await getInstance();
    const request = await pool.request()
        .input('UserId',sql.UniqueIdentifier,id)
        .query("exec GetUserStatus @UserId");
    
    const result = request.recordset;

    return result[0];
}