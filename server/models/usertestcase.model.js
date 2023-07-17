const sql = require('mssql');
const { getInstance } = require('./pool');

exports.getMaxIdUserTestcaseSql = async (
    exerciseId,
    userId) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('UserId', sql.UniqueIdentifier, userId)
        .input('ExerciseId', sql.UniqueIdentifier, exerciseId)
        .query('exec GetMaxIdUserTestcase @ExerciseId, @UserId');

    const result = request.recordset[0].Id;
    return result;
}

exports.getNewOrderUserTestcaseSql= async (exerciseId, userId) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('UserId', sql.UniqueIdentifier, userId)
        .input('ExerciseId', sql.UniqueIdentifier, exerciseId)
        .query('exec GetNewOrderUserTestcase @ExerciseId, @UserId');

    const result = request.recordset[0].TestOrder;
    return result;
}

exports.createUserTestcaseSql = async (
    id,
    userId,
    exerciseId,
    input,
    output,
    testOrder
) => {
    const pool = await getInstance();

    await pool.request()
        .input('Id', sql.Int, id)
        .input('UserId', sql.UniqueIdentifier, userId)
        .input('ExerciseId', sql.UniqueIdentifier, exerciseId)
        .input('Input', sql.NVarChar, input)
        .input('ExpectedOutput', sql.NVarChar, output)
        .input('TestOrder', sql.Int, testOrder)
        .execute(`CreateUserTestcase`);
    return;
}

exports.getAllUserTestcaseSql = async (
    userId,
    exerciseId
) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('UserId', sql.UniqueIdentifier, userId)
        .input('ExerciseId', sql.UniqueIdentifier, exerciseId)
        .query('exec GetAllUserTestcase @UserId, @ExerciseId');

    const result = request.recordset;
    return result;
}

exports.getUserTestcaseSql = async (
    exerciseId,
    userId,
    id
) => {
    const pool = await getInstance();

    const request = await pool.request()
        .input('ExerciseId', sql.UniqueIdentifier, exerciseId)
        .input('UserId', sql.UniqueIdentifier, userId)
        .input('Id', sql.Int, id)
        .query('exec GetUserTestcase @ExerciseId, @UserId, @Id');

    const result = request.recordset[0];

    return result;
}

exports.updateUserTestcaseSql = async (
    id,
    userId,
    exerciseId,
    input,
    output,
    testOrder
) => {
    const pool = await getInstance();

    await pool.request()
        .input('Id', sql.Int, id)
        .input('UserId', sql.UniqueIdentifier, userId)
        .input('ExerciseId', sql.UniqueIdentifier, exerciseId)
        .input('Input', sql.NVarChar, input)
        .input('ExpectedOutput', sql.NVarChar, output)
        .input('TestOrder', sql.Int, testOrder)
        .execute(`UpdateUserTestcase`);
    return;
}

exports.deleteUserTestcaseSql = async (
    exerciseId,
    userId,
    id
) => {
    const pool = await getInstance();

    await pool.request()
        .input('ExerciseId', sql.UniqueIdentifier, exerciseId)
        .input('UserId', sql.UniqueIdentifier, userId)
        .input('Id', sql.Int, id)
        .execute('DeleteUserTestcase');

    return;
}

exports.swapUserTestcaseSql = async (
    exerciseId,
    userId,
    testOrder1,
    testOrder2
) => {
    const pool = await getInstance();

    await pool.request()
        .input('ExerciseId', sql.UniqueIdentifier, exerciseId)
        .input('UserId', sql.UniqueIdentifier, userId)
        .input('TestOrder1', sql.Int, testOrder1)
        .input('TestOrder2', sql.Int, testOrder2)
        .execute('SwapOrderUserTestcase');
    
    return;
}