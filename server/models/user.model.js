const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');

exports.registerUser = async (id,username, hashedPassword, fullname, email) => {
    
        const pool = await sql.connect(sqlConfig);
        await pool.request()
            .input('id',sql.UniqueIdentifier,id)
            .input('username',sql.VarChar(20),username)
            .input('email',sql.VarChar,email)
            .input('hashedPassword',sql.VarChar,hashedPassword)
            .input('fullName',sql.NVarChar,fullname)
            .execute('RegisterPlpUser');
        await pool.close();

        return;
}

exports.getUserByUsername = async (username) => {
    const pool = await sql.connect(sqlConfig);
    const request = await pool.request()
        .input('username',sql.VarChar(20),username)
        .query("exec GetUserByUsername @username");
    
    const result = request.recordset;
    await pool.close();
    return result[0];
}

exports.getUserById = async (identity) => {
    const pool = await sql.connect(sqlConfig);
    const request = await pool.request()
        .input('id',sql.UniqueIdentifier,identity)
        .query("exec GetUserById @id");
    
    const result = request.recordset;
    await pool.close();
    return result[0];
}

exports.updateRefreshToken = async (id, refreshToken, expiryDate) => {
    const pool = await sql.connect(sqlConfig);
    await pool.request()
        .input('id',sql.UniqueIdentifier,id)
        .input('refreshToken',sql.VarChar,refreshToken)
        .input('expiryDate',sql.DateTime,expiryDate)
        .execute("UpdateRefreshToken");
    await pool.close();
    return;   
}

exports.updateProfile = async (id, fullName, email, avatar) => {
    const pool = await sql.connect(sqlConfig);
    await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .input('fullName', sql.NVarChar, fullName)
        .input('email', sql.VarChar, email)
        .input('avatar',sql.NVarChar,avatar)
        .execute("UpdateProfile");
    await pool.close();
    return;
}

exports.changePassword = async (id, hashedPassword) => {
    const pool = await sql.connect(sqlConfig);
    await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .input('hashedPassword', sql.NVarChar, hashedPassword)
        .execute("ChangePassword");
    await pool.close();
    return;
}