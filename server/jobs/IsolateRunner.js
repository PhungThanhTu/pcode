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
    const compileScript =  `-- /usr/bin/g++ -Wfatal-errors -w -o ${submissionId} ${submissionId}.${extension}`;
    const compileOutput = `${BOX_DIR_PREFIX}${boxid}/box/compile_${submissionId}.out`;
    const compileMetaName = `${BOX_DIR_PREFIX}${boxid}/box/compile_${submissionId}.txt`;
    try {
        execSync(`isolate -b ${boxid} --mem 128000 --time 2 -p -E PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin -o ${compileOutput} --stderr-to-stdout -M ${compileMetaName} --run ${compileScript}`);
        return submissionId;
    }
    catch (err) {
        console.log('Compile failed');
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

    let runStatus = 1;
    const isActualOutputMatches = expectedOutput.trim() === actualOutput.trim();
    if(!isActualOutputMatches) runStatus = 2;

    const jsonMetaString = '{"' + metaString.replace(/\n/g, '","').replace(/:/g, '":"').replace(/max-rss/,"maxRss") + '"}';
    const metaJsonObject = JSON.parse(jsonMetaString);

    const runTime = metaJsonObject.time;

    const memoryUsage = metaJsonObject.maxRss;

    const exitCode = metaJsonObject.exitcode || -1;
    
    let status = metaJsonObject.status;
    
    if(status)
    {
        if(status === 'RE') runStatus = 4;
        if(status === 'SG') runStatus = 4;
        if(status === 'TO') runStatus = 6;
        if(status === 'XX') runStatus = 7;
    }

    if(!status)
        status = 'RN';

    if(memoryUsage > memoryLimit) runStatus = 5;

    let errorOutput = '';
    if(exitCode !== 0)
        errorOutput = actualOutput

    return {
        runTime,
        memoryUsage,
        runStatus,
        exitCode,
        actualOutput,
        expectedOutput,
        errorOutput,
        memoryLimit,
        status
    }
}

const runTestCase = async (testId,boxid, runScript, inputPath, runFile, timeLimit) => {
    const metaFile = `${BOX_DIR_PREFIX}${boxid}/box/run_${testId}.txt`;
    const actualOutputPath = `${BOX_DIR_PREFIX}${boxid}/box/${testId}.out`
    const runCommand = `isolate -b ${boxid} --time ${timeLimit} -p -E PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin -M ${metaFile} -i ${inputPath} -o ${actualOutputPath} --stderr-to-stdout --run ${runScript}${runFile}`;
    try {
        console.log(`Judging test case ${testId}`);
        execSync(runCommand);
    }
    catch (err)
    {
        console.log(`Cannot run the source code in test case ${testId}`);
    }
    finally {
        return actualOutputPath;
    }
}

const judgeSingleTestcase = async (testcase, runScript, boxid, runFile, timeLimit, memoryLimit, compileResult) => {

    const testId = testcase.testId;
    const input = testcase.input;
    const inputPath = await populateInputFile(boxid,testId,input);
    const expectedOutput = testcase.expectedOutput;
    if(compileResult.exitCode == 0)
    {
        console.log('No complile error');
        const actualOutputPath = await runTestCase(testId,boxid,runScript,inputPath,runFile,timeLimit);
        const testResult = await verifyTestcase(testId,boxid,expectedOutput,actualOutputPath,memoryLimit);
        return testResult;
    }

    return {
        runStatus: 3,
        exitCode: -1,
        runTime: 0,
        memoryUsage: 0,
        actualOutput: compileResult.actualOutput
    }

}

const verifyCompileResult = async (submissionId, boxid) => {
    const compileMetaPath = `${BOX_DIR_PREFIX}${boxid}/box/compile_${submissionId}.txt`;
    const compileOutput = `${BOX_DIR_PREFIX}${boxid}/box/compile_${submissionId}.out`;
    const compiledMetaBuffer = await fs.readFile(compileMetaPath);
    const outputBuffer = await fs.readFile(compileOutput);
    const outputString = outputBuffer.toString('utf-8');
    const pattern = new RegExp(submissionId,'g');
    const anonymizedOutputString = outputString.replace(pattern,'main');
    const compliedMetaString = compiledMetaBuffer.toString('utf-8').trim();

    const metaJsonString = '{"' + compliedMetaString.replace(/\n/g, '","').replace(/:/g, '":"').replace(/max-rss/,"maxRss") + '"}';
    const metaJsonObject = JSON.parse(metaJsonString);

    const runTime = metaJsonObject.time;

    const memoryUsage = metaJsonObject.maxRss;

    const exitCode = metaJsonObject.exitcode;

    return {
        runTime,
        memoryUsage,
        exitCode,
        actualOutput: anonymizedOutputString
    }
}

module.exports = { 
    judgeSubmission: async (submissionId, exerciseId ,languageId) =>
    {
        try
        {   
            const exercise = await getExercise(exerciseId);
            const language = await getLanguageExtension(languageId);
            const extension = language.fileExtension;

            if(!language)
            {
                throw new Error("SQL Connection Error")
            }

            const sourceCode = await getSourceCode(submissionId,languageId);
            const testcases = await getTestCases(submissionId);

            if(!testcases || testcases.length === 0) throw new Error('No test case specified');

            const randomBoxId = generateRandomBoxId();

            while(true) {
                const boxIsExists = await checkBoxAlreadyExists(randomBoxId);
                if(boxIsExists)
                    randomBoxId = generateRandomBoxId();
                else
                    break;
            }
            const boxid = randomBoxId;

            try {     
                execSync(`isolate --cg --init -b ${boxid}`);
                console.info(`Successfully initialized a box at path ${BOX_DIR_PREFIX}${boxid}`)
            }
            catch(err)
            {
                throw new Error(`Init box failed ${err}`)
            }
            try {
            const sourceCodePath = `${BOX_DIR_PREFIX}${boxid}/box/${submissionId}.${extension}`;

            await writeSourceCode(sourceCodePath,sourceCode);
            const compiledFile = await compileSourceCode(submissionId,extension,boxid);
            const compileResult = await verifyCompileResult(submissionId,boxid);

            const memoryLimit = exercise.memoryLimit;
            const timeLimit = exercise.runtimeLimit/ 1000;

            const testResults = [];
            for(const testcase of testcases) {
                const result = await judgeSingleTestcase(testcase,'./',boxid,compiledFile,timeLimit,memoryLimit,compileResult);
                testResults.push(result);
            }

            console.log('ALL TEST CASES HAS BEEN JUDGED: ');
            console.log(testResults);
            }
            catch(err) {
                throw new Error(`Judging failed ${err}`);
            }
            finally {
                try {     
                    execSync(`isolate --cg --cleanup -b ${boxid}`);
                    console.info(`Successfully cleanup box ${boxid}`)
                }
                catch(err)
                {
                    console.log(`Cleanup box failed ${err}`)
                }
            }
        }
        catch (err) {
            console.error(err);
        }          
    }
}





module.exports.judgeSubmission('40a50118-e207-4672-9a44-7bf0aa51be76','c7f5f23d-ebdf-4262-b050-97aa5590aa03',2);