const { exec,execSync } = require('child_process');
const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig');
const fs = require('fs/promises')

const BOX_DIR_PREFIX = '/usr/local/etc/isolate/example/'

const getExercise = async (id) => {
    const query = "select * from [dbo].[Exercise] where id = @id";

    const pool = await sql.connect(sqlConfig);
    const request = await pool.request().input('id',sql.UniqueIdentifier,id).query(query);
    await pool.close();
    const result = request.recordset[0];
    console.log(result);
    return result;
}

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
    const result = request.recordset;
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

const verifyTestcase = async (testId, boxid, expectedOutput, actualOutputPath, memoryLimit) => {
    const metaFile = `${BOX_DIR_PREFIX}${boxid}/box/run_${testId}.txt`;
    const metaBuffer = await fs.readFile(metaFile);
    const metaString = metaBuffer.toString('utf-8').trim();

    const actualOutputBuffer = await fs.readFile(actualOutputPath);
    const actualOutput = actualOutputBuffer.toString('utf-8');
    console.log(`\tACTUAL OUTPUT: ${actualOutput}`);

    let runStatus = 1;
    const isActualOutputMatches = expectedOutput.trim() === actualOutput.trim();
    if(!isActualOutputMatches) runStatus = 2;

    const jsonMetaString = '{"' + metaString.replace(/\n/g, '","').replace(/:/g, '":"').replace(/max-rss/,"maxRss") + '"}';
    const metaJsonObject = JSON.parse(jsonMetaString);
    console.log(jsonMetaString);
    console.info(`TESTCASE ${testId} DONE:`);

    const runTime = metaJsonObject.time;
    console.log(`\tRUNTIME: ${runTime}`);

    const memoryUsage = metaJsonObject.maxRss;
    console.log(`\tMEMORY USAGE: ${memoryUsage}`)

    const exitCode = metaJsonObject.exitcode;
    console.log(`\tEXIT CODE: ${exitCode}`);
    
    const status = exitCode.status;
    
    if(status)
    {
        if(status === 'RE') runStatus = 4;
        if(status === 'SG') runStatus = 4;
        if(status === 'TO') runStatus = 6;
        if(status === 'XX') runStatus = 7;
    }

    if(memoryUsage > memoryLimit) runStatus = 5;

    console.log(`\tRUN STATUS: ${runStatus}`);

    let errorOutput = '';
    if(exitCode !== 0)
        errorOutput = actualOutput

    return {
        runTime,
        memoryUsage,
        runStatus,
        exitCode,
        actualOutput,
        errorOutput,
        memoryLimit
    }
}

const runTestCase = async (testId,boxid, runScript, inputPath, runFile) => {
    const metaFile = `${BOX_DIR_PREFIX}${boxid}/box/run_${testId}.txt`;
    const actualOutputPath = `${BOX_DIR_PREFIX}${boxid}/box/${testId}.out`
    const runCommand = `isolate -b ${boxid} -p -E PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin -M ${metaFile} -i ${inputPath} -o ${actualOutputPath} --stderr-to-stdout --run ${runScript}${runFile}`;
    try {
        execSync(runCommand);
        return actualOutputPath;
    }
    catch (err)
    {
        throw new Error(`Cannot run the source code in test case ${testId}`)
    }
}

const judgeSingleTestcase = async (testcase, runScript, boxid, runFile, memoryLimit) => {

    const testId = testcase.testId;
    const input = testcase.input;
    const inputPath = await populateInputFile(boxid,testId,input);
    const expectedOutput = testcase.expectedOutput;

    const actualOutputPath = await runTestCase(testId,boxid,runScript,inputPath,runFile);
    const testResult = await verifyTestcase(testId,boxid,expectedOutput,actualOutputPath,memoryLimit);

    console.log(`done judging testcase ${testId} result:`);
    console.log(testResult);
    return testResult;
}

const getCompileResult = async (submissionId) => {
    
}

async function judgeSubmission(submissionId, exerciseId ,languageId) 
{
    try
    {   
        const exercise = await getExercise(exerciseId);
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
        if(!testcases || testcases.length === 0) throw new Error('No test case specified');

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

        // run testcases
        const memoryLimit = exercise.memoryLimit;

        const testResults = [];

        for(const testcase of testcases) {
            const result = await judgeSingleTestcase(testcase,'./',boxid,compiledFile,memoryLimit);
            testResults.push(result);
        }
        
        // clean up
        try {     
            execSync(`isolate --cg --cleanup -b ${boxid}`);
            console.info(`Successfully cleanup box ${boxid}`)
        }
        catch(err)
        {
            throw new Error(`Cleanup box failed ${err}`)
        }

    }
    catch (err) {
        console.error(err);
    }
}




judgeSubmission('40a50118-e207-4672-9a44-7bf0aa51be76','c7f5f23d-ebdf-4262-b050-97aa5590aa03',2);
//populateInputFile(759,'8EFA93AD-0DAE-4A6D-9E6D-55777A4645BF','1 2');

//runTestCase('8EFA93AD-0DAE-4A6D-9E6D-55777A4645BF',759,'./40a50118-e207-4672-9a44-7bf0aa51be76','8EFA93AD-0DAE-4A6D-9E6D-55777A4645BF.in','40a50118-e207-4672-9a44-7bf0aa51be76');

//verifyTestcase('8EFA93AD-0DAE-4A6D-9E6D-55777A4645BF',759,'3',`${BOX_DIR_PREFIX}759/box/8EFA93AD-0DAE-4A6D-9E6D-55777A4645BF.out`,12800)

//getExercise('C7F5F23D-EBDF-4262-B050-97AA5590AA03');

getTestCases('40a50118-e207-4672-9a44-7bf0aa51be76');