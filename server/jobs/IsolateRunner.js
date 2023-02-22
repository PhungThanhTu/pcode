const { exec,execSync } = require('child_process');
const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');
const fs = require('fs/promises')

const BOX_DIR_PREFIX = '/usr/local/etc/isolate/example/'

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

const getTestCases = async (id) => {
   const pool = await sql.connect(sqlConfig);
   const query = "EXEC GetTestCasesBySubmissionId @Id";
   const request = await pool.request()
        .input('Id',sql.UniqueIdentifier,id)
        .query(query);
    pool.close();
    const result = request.recordset[0];
    console.log(result);
    return result;
}

const generateRandomBoxId = () => {
    return Math.floor(Math.random() * 1000);
}

const checkBoxAlreadyExists = async (boxid) => {
    try {
        await fs.access(`${BOX_DIR_PREFIX}${boxid}/`);
        return true;
    }
    catch {
        return false;
    }
}

const writeSourceCode = async (path,sourceCode) => {
    await fs.writeFile(path,sourceCode);
}

const compileSourceCode = async (submissionId,extension,boxid) => {
    const compileScript =  `-- /usr/bin/g++ -o ${submissionId} ${submissionId}.${extension}`;
    const compileMetaName = `${BOX_DIR_PREFIX}${boxid}/box/compile_${submissionId}.txt`;
    try {
        execSync(`isolate -b ${boxid} --mem 128000 --time 2 -p -E PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin -M ${compileMetaName} --run ${compileScript}`);
        return submissionId;
    }
    catch (err) {
        throw new Error(`Compile filed with error ${err}`);
    }

}

const populateInputFile = async (boxid,testId,input) => {
    try {
        const inputPath = `${BOX_DIR_PREFIX}${boxid}/box/${testId}.in`;
        await fs.writeFile(inputPath,input);
        return inputPath;
    }
    catch (err)
    {
        throw new Error(`Cannot create input file in testcase ${testId}`)
    }
}

const verifyTestcase = async (testId, metaFile, expectedOutput, actualOutputPath) => {
    // run time
    // memory usage
    // exit code 
    // actual stdout
    // stderr
}

const runTestCase = async (testId,boxid, runScript, inputPath, runFile) => {
    const metaFile = `${BOX_DIR_PREFIX}${boxid}/box/run_${testId}.txt`;
    const actualOutputPath = `${BOX_DIR_PREFIX}${boxid}/box/${testId}.out`
    const runCommand = `isolate -b ${boxid} -p -E PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin -M ${metaFile} -i ${inputPath} -o ${actualOutputPath} --run ${runScript}${runFile}`;
    try {
        execSync(runCommand);
        return actualOutputPath;
    }
    catch (err)
    {
        throw new Error(`Cannot run the source code in test case ${testId}`)
    }
}


const judgeSingleTestcase = async (testcase, runScript, boxid, runFile) => {
    // populate input files
    const testId = testcase.testId;
    const input = testcase.input;
    const inputPath = await populateInputFile(boxid,testId,input);
    // run code
    const actualOutputPath = await runTestCase(testId,boxid,runScript,inputPath,runFile);
    // get actual output
    // compare with expected output
    // verify meta result
    // update test result database
}

async function judgeSubmission(submissionId,languageId) 
{
    try
    {
        const language = await getLanguageExtension(languageId);
        const extension = language.fileExtension;
        console.log("Extension of this submission");
        console.log(extension);
        if(!language)
        {
            throw new Error("SQL Connection Error")
        }

        const sourceCode = await getSourceCode(submissionId,languageId);
        console.log("Source code of this submission");
        console.log(sourceCode);

        const testcases = await getTestCases(submissionId);
        console.log("Test cases: ");
        console.log(testcases);

        const randomBoxId = generateRandomBoxId();
        console.log("Box id");
        console.log(randomBoxId);

        while(true) {
            const boxIsExists = await checkBoxAlreadyExists(randomBoxId);
            if(boxIsExists)
                randomBoxId = generateRandomBoxId();
            else
                break;
        }
        const boxid = randomBoxId;
        console.log(`found available box : ${boxid}`)     
        // init box
        try {     
            execSync(`isolate --cg --init -b ${boxid}`);
            console.info(`Successfully initialized a box at path ${BOX_DIR_PREFIX}${boxid}`)
        }
        catch(err)
        {
            throw new Error(`Init box failed ${err}`)
        }
        // populate files (source code, input file)
        const sourceCodePath = `${BOX_DIR_PREFIX}${boxid}/box/${submissionId}.${extension}`;
        await writeSourceCode(sourceCodePath,sourceCode);
        // compile code
        const compiledFile = await compileSourceCode(submissionId,extension,boxid);


        
            
            
        // clean up
    }
    catch (err) {
        console.error(err);
    }
}




judgeSubmission('40a50118-e207-4672-9a44-7bf0aa51be76',2);
//populateInputFile(759,'8EFA93AD-0DAE-4A6D-9E6D-55777A4645BF','1 2');

//runTestCase('8EFA93AD-0DAE-4A6D-9E6D-55777A4645BF',759,'./40a50118-e207-4672-9a44-7bf0aa51be76','8EFA93AD-0DAE-4A6D-9E6D-55777A4645BF.in','40a50118-e207-4672-9a44-7bf0aa51be76');

