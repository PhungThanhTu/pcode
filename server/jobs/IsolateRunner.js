const { exec } = require('child_process');
const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');
const fs = require('fs/promises')

const getLanguageExtension = async (id) => {
    const query = "select * from [dbo].[ProgrammingLanguage] where id = @id";

    const pool = await sql.connect(sqlConfig);
    const request = await pool.request().input('id',sql.Int,id).query(query);
    await pool.close();
    const result = request.recordset[0];
    return result;
}

const getSourceCode = async (id, languageId) => {
    const query = "select * from [dbo].[SubmissionSourceCode] where submissionId = @id and programmingLanguageId = @languageId";
    const pool = await sql.connect(sqlConfig);
    const request = await pool.request()
        .input('id',sql.UniqueIdentifier,id)
        .input('languageId',sql.Int,languageId)
        .query(query);
    await pool.close();
    const result = request.recordset[0];
    return result.sourceCode;
}

async function judgeSubmission(submissionId,languageId) 
{
    try
    {
        // get language file extension
        const language = await getLanguageExtension(languageId);
        const extension = language.fileExtension;
        console.log("Extension of this submission");
        console.log(extension);
        if(!language)
        {
            throw new Error("SQL Connection Error")
        }
        // get source code
        const sourceCode = await getSourceCode(submissionId,languageId);
        console.log("Source code of this submission");
        console.log(sourceCode);
        // get test case

        // generate box id

        // check box id

        // init box

        // populate files (source code, input file)

        // compile code

        // foreach test case
            // run code
            // verify meta result
            // update test result database
        // clean up
    }
    catch (err) {
        console.error(err);

    }

}




judgeSubmission('137bc48a-fa98-4167-abc4-889f61a2e2db',2);