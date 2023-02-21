require('dotenv').config();
const sql = require('mssql');
const {sqlConfig} = require('./configs/mssqlConfig');
const { registerUser, getUserByUsername } = require('./models/auth.model');
const { registerRequestSchema} = require('./schema/auth.schema');

const tryConnectSQL = async () => {
    try {
        await sql.connect(sqlConfig);
        console.log("connected success");
    }
    catch (err)
    {
        console.log("Connect failed");
        console.log(err);
    }
}

const invalidObject = { username: 'abc', birth_year: 1994 };
const validObject = {
    username: "sampleuser1",
    password: "samplepassword",
    email: "sampleemailz@email.com",
    fullName: "Sample Full Name"
}

const tryCheckJoiValidation = async () => {
    try {
        const value = await registerRequestSchema.validateAsync(validObject);
        console.log("Joi validate success");
        console.log(value);
    }
    catch(err) {
        console.log("Joi Validate Failed");
        console.log(err.message);
    }
}

const tryRegisterUser = async () => {
    try {
        await registerUser("04a8f338-a9b4-4975-9055-e1251cc7c8a8","sampleuser1","asdadasd","Sam Ple","sample@gmail.com");
        console.log("register success");
    }
    catch(err) {
        console.log("Register failed");
        console.log(err.message);
    }
}
const tryGetUserByUsername = async (username) => {
    try {
        const result = await getUserByUsername(username);
        console.log("queried register success");
        console.log(result);
    }
    catch(err) {
        console.log("query failed");
        console.log(err);
    }
}


tryGetUserByUsername("notavail");
