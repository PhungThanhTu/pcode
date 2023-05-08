const { execSync } = require('child_process');
const sql = require('mssql');
const sqlConfig = require('../configs/mssqlConfig')
const fs = require('fs/promises');
const { getSubmissionByIdSql, updateSubmissionTestResultSql } = require('../models/submission.model');
const logger = require('../utils/logger');
const { getProgrammingLanguageByIdSql } = require('../models/language.model');
const {replaceAll} = require('../utils/string');
const { getTestCaseBySubmissionIdSql } = require('../models/testcase.model');
const { getExerciseByIdSql } = require('../models/exercise.model');
const { write } = require('fs');
const { getJudgerByIdSql } = require('../models/judger.model');

const BOX_DIR_PREFIX = '/usr/local/etc/isolate/sandboxes/';
const EXTENSION_PARAM_NAME = '$EXTENSION';
const FILENAME_PARAM_NAME = '$FILENAME';
const FILENAME = 'source';
const COMPILE_OUTPUT_FILENAME = 'compile.out';
const COMPILE_META_FILENAME = 'compile.meta';
const MAX_COMPILE_MEMORY = 128000;
const MAX_COMPILE_TIME = 2;
const DEFAULT_ENV = 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin';
const DEFAULT_JUDGER_PATH = '/engine/judger/';
const JudgeStatus = {
    PENDING: -1,
    FAIL_AT_COMPILE: 0,
    FAIL_AT_RUN: 1,
    FAIL_AT_JUDGE:2,
    SUCCESS: 3
}

const RunStatus = {
    PENDING: 0,
    ACCEPTED: 1,
    WRONG: 2,
    COMPILATION_ERROR: 3,
    RUNTIME_ERROR: 4,
    MEMORY_EXCEED: 5,
    TIME_EXCEED: 6,
    OTHERS: 7
}

const generateRandomBoxId = () => {
    return Math.floor(Math.random() * 1000);
}

const createIsolateBox = async (boxid) => {
    try {     
        execSync(`isolate --cg --init -b ${boxid}`);
        logger.success(`Successfully initialized a box at path ${BOX_DIR_PREFIX}${boxid}`)
    }
    catch(err)
    {
        throw new Error(`Init box failed ${err}`)
    }
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

const compileSubmissionSourceCode = async (boxid, compileScript) => {
    const compileOutput = `${BOX_DIR_PREFIX}${boxid}/box/${COMPILE_OUTPUT_FILENAME}`;
    const compileMetaName = `${BOX_DIR_PREFIX}${boxid}/box/${COMPILE_META_FILENAME}`;

    try {
        execSync(`isolate -b ${boxid} --mem ${MAX_COMPILE_MEMORY} --time ${MAX_COMPILE_TIME} -p -E ${DEFAULT_ENV} -o ${compileOutput} --stderr-to-stdout -M ${compileMetaName} --run -- ${compileScript}`)
        logger.success('source code comilation success with result:')
    }
    catch (err)
    {
        throw err;
    }
}


const metaStringToJson = (metaString) => {
    const jsonMetaString = '{"' + metaString.replace(/\n/g, '","').replace(/:/g, '":"').replace(/max-rss/,"maxRss") + '"}';
    const metaJsonObject = JSON.parse(jsonMetaString);
    return metaJsonObject;
}

const writeFile = async (path, content) => {
    try 
    {
        await fs.writeFile(path, content);
        logger.success(`Write content ${content} in path ${path} success`)
    }
    catch (err)
    {
        logger.error(`Write content ${content} in path ${path} failed`);
    }
}

const readFileFromPath = async (path) => {
    try 
    {
        const buffer = await fs.readFile(path);
        const content = buffer.toString('utf-8').trim();
        logger.success(`Read content in path ${path} success`);
        return content;
    }
    catch (err)
    {
        logger.error(`Read content in path ${path} failed`);
    }
}

const copyFile = async (source, dest) => {
    try 
    {
        await fs.copyFile(source, dest);
        logger.success(`Copy file from ${source} to ${dest} success`)
    }
    catch (err)
    {
        logger.success(`Copy file from ${source} to ${dest} failed`)
    }
}

const runSubmissionTestCase = async (boxid, testCase, runScript, exerciseSpec, judgerFileName) => {
    const testId = testCase.Id;
    const metaPath = `${BOX_DIR_PREFIX}${boxid}/box/${testId}.meta`;
    const inputPath = `${BOX_DIR_PREFIX}${boxid}/box/${testId}.in`;
    const expectedPath = `${BOX_DIR_PREFIX}${boxid}/box/${testId}.expected`;
    const actualPath = `${BOX_DIR_PREFIX}${boxid}/box/${testId}.actual`;
    const judgeResultMeta = `${BOX_DIR_PREFIX}${boxid}/box/${testId}.judge.meta`;
    const judgeResultOutput = `${BOX_DIR_PREFIX}${boxid}/box/${testId}.judge.out`;
    const timeLimit = exerciseSpec.RuntimeLimit / 1000;
    const runCommand = `isolate -b ${boxid} --time ${timeLimit} -p -E PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin -M ${metaPath} -i ${inputPath} -o ${actualPath} --stderr-to-stdout --run ${runScript}`;
    const judgeCommand = `isolate -b ${boxid} -p -E PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin -M ${judgeResultMeta} -o ${judgeResultOutput} --stderr-to-stdout --run ./${judgerFileName} ${expectedPath} ${actualPath}`;
    let judgeStatus = JudgeStatus.PENDING;
    try {
        execSync(runCommand);
        logger.success(`Run test case success ${testId}`);
        try {
            execSync(judgeCommand);
            logger.success(`Judge test case success ${testId}`);
            judgeStatus = JudgeStatus.SUCCESS;
        }
        catch (err)
        {
            logger.error(`Judge test case ${testId} failed`);
            logger.error(err);
            judgeStatus = JudgeStatus.FAIL_AT_JUDGE;
        }
    }
    catch (err)
    {
        logger.error(`Run test case ${testId} failed`);
        logger.error(err);
        judgeStatus = JudgeStatus.FAIL_AT_RUN;
    }

    return judgeStatus;
}

const judgeSingleSubmissionTestcase = async (boxid, testCase, runCommand, exerciseSpec, judgerFileName) => {
    const testId = testCase.Id;
    const input = testCase.Input;
    const expected = testCase.Output;

    const inputPath = `${BOX_DIR_PREFIX}${boxid}/box/${testId}.in`;
    const expectedPath = `${BOX_DIR_PREFIX}${boxid}/box/${testId}.expected`;
    await writeFile(inputPath, input);
    await writeFile(expectedPath, expected);
    return await runSubmissionTestCase(boxid, testCase, runCommand, exerciseSpec, judgerFileName);

}

const getTestResultWithCompilationError = async (boxid, testcases) => {
    let testResults = [];
    for(const testcase of testcases) {
        const metaPath = `${BOX_DIR_PREFIX}${boxid}/box/${COMPILE_META_FILENAME}`;
        const outputPath = `${BOX_DIR_PREFIX}${boxid}/box/${COMPILE_OUTPUT_FILENAME}`;
        const meta = await readFileFromPath(metaPath);
        const output = await readFileFromPath(outputPath);
        const metaJson = metaStringToJson(meta);

        const testId = testcase.Id;

        const runTime = Number(metaJson.time) * 1000;

        const memoryUsage = Number(metaJson.maxRss);
    
        const exitCode = Number(metaJson.exitcode);

        const runStatus = RunStatus.COMPILATION_ERROR;

        const testResult = {
            TestId: testId,
            Time: runTime,
            Memory: memoryUsage,
            Output: output,
            ExitCode: exitCode,
            RunStatus: runStatus
        }
        testResults.push(testResult);
    }
    return testResults;
}

const getTestResultWithSuccess = async (boxid, testCasesWithJudgeStatus, exerciseSpec) => {
    let testResults = [];
    for (const testCaseWithJudgeStatus of testCasesWithJudgeStatus)
    {
        const testId = testCaseWithJudgeStatus.Id;
        const metaPath = `${BOX_DIR_PREFIX}${boxid}/box/${testId}.meta`;
        const outputPath = `${BOX_DIR_PREFIX}${boxid}/box/${testId}.actual`;

        const metaString = await readFileFromPath(metaPath);
        const meta = metaStringToJson(metaString);
        
        const output = await readFileFromPath(outputPath);
        const time = meta.time * 1000

        let runStatus = 1;

        let status = meta.status;

        const memoryLimit = Number(exerciseSpec.MemoryLimit);
        const memory = Number(meta.maxRss);

        let exitcode = Number(meta.exitcode);

        if(testCaseWithJudgeStatus.judgeStatus === JudgeStatus.FAIL_AT_RUN && status)
        {
            logger.warn('RUN STATUS :');
            logger.info(status);
            if(status === 'RE') runStatus = RunStatus.RUNTIME_ERROR;
            if(status === 'SG') runStatus = RunStatus.RUNTIME_ERROR;
            if(status === 'TO') runStatus = RunStatus.TIME_EXCEED;
            if(status === 'XX') runStatus = RunStatus.OTHERS;
            exitcode = -1;
            
        }

        if(!status)
        {
            status = 'RN';
            if(testCaseWithJudgeStatus.judgeStatus === JudgeStatus.FAIL_AT_JUDGE) runStatus = RunStatus.WRONG;
        }

        if(memory > memoryLimit) runStatus = RunStatus.MEMORY_EXCEED;

        const testResult = {
            TestId: testId,
            Time: time,
            Memory: memory,
            Output: output,
            ExitCode: exitcode,
            RunStatus: runStatus
        }
        testResults.push(testResult);
    }
    return testResults;
}

const judgeSubmissionTestcases = async (boxid, testcases, programmingLanguageSpec, exerciseSpec, judger) => {
    
    const testcasesWithJudgeStatus = [];
    const runCommand = programmingLanguageSpec.RunCommand;
    const runScript = runCommand.replaceAll(FILENAME_PARAM_NAME, FILENAME);
    const judgerFileName = judger.FileName;
    for(const testcase of testcases) {
        const judgeStatus = await judgeSingleSubmissionTestcase(boxid, testcase, runScript, exerciseSpec, judgerFileName);
        const testcaseWithJudgeStatus = {
            ...testcase,
            judgeStatus
        }
        testcasesWithJudgeStatus.push(testcaseWithJudgeStatus);
    }
    return testcasesWithJudgeStatus;
}

const verifySubmissionCompileResult = async (boxid) => {
    const compileMetaPath = `${BOX_DIR_PREFIX}${boxid}/box/${COMPILE_META_FILENAME}`;
    const compileOutput = `${BOX_DIR_PREFIX}${boxid}/box/${COMPILE_OUTPUT_FILENAME}`;

    const compiledMetaBuffer = await fs.readFile(compileMetaPath);
    const outputBuffer = await fs.readFile(compileOutput);

    const compiledMetaString = compiledMetaBuffer.toString('utf-8');
    const outputString = outputBuffer.toString('utf-8');

    const metaJsonString = '{"' + compiledMetaString.trim().replace(/\n/g, '","').replace(/:/g, '":"').replace(/max-rss/,"maxRss") + '"}';
    const metaJsonObject = JSON.parse(metaJsonString);

    const time = Number(metaJsonObject.time) * 1000;
    const memory = Number(metaJsonObject.maxRss);
    const exitCode = Number(metaJsonObject.exitcode);
    const output = outputString;

    const compileResult = {
        time,
        memory,
        exitCode,
        output
    };

    return compileResult;
}

const cleanIsolateBox = async (boxid) => {
    try {     
        execSync(`isolate --cg --cleanup -b ${boxid}`);
        logger.success(`Successfully cleanup box ${boxid}`)
    }
    catch(err)
    {
        logger.error(`Cleanup box failed ${err}`)
    }
}

module.exports = { 
    automatedJudgeSubmission: async (submissionId) => {
        try {
            const submission = await getSubmissionByIdSql(submissionId);
            const exerciseId = submission.ExerciseId;
            const programmingLanguageId = submission.ProgrammingLanguageId;
            const sourceCode = submission.SourceCode;

            logger.success(`Retrieved exercise Id ${exerciseId}`);
            logger.success(`Retrieved programmmingLanguageId ${programmingLanguageId}`);
            logger.success(`Retrieved source code ${sourceCode}`);

            const programmingLanguageSpec = await getProgrammingLanguageByIdSql(programmingLanguageId);
            logger.success(`Retrieved programming language specification:`)
            logger.info(JSON.stringify(programmingLanguageSpec, null , 2));

            const exerciseSpec = await getExerciseByIdSql(exerciseId);
            logger.success(`Retrieved exercise spec from exercise id ${exerciseId}`);
            logger.info(exerciseSpec);

            const judgerId = exerciseSpec.JudgerId;
            const judger = await getJudgerByIdSql(judgerId);

            if(!judger){
                throw new Error("Invalid judger")
            }

            logger.success(`Get Judger success ${judger.DisplayName}`);


            const compileCommand = programmingLanguageSpec.CompileCommand || '';
            const sourceCodeExtension = programmingLanguageSpec.FileExtension;

            const paramAppliedCompileCommand =
                compileCommand
                    .replaceAll(FILENAME_PARAM_NAME, FILENAME)
                    .replaceAll(EXTENSION_PARAM_NAME, sourceCodeExtension);
            
            logger.success(`Retrieved compile command and apply params success`);
            logger.info(paramAppliedCompileCommand);

            const testCases = await getTestCaseBySubmissionIdSql(submissionId);

            if(!testCases || testCases.length === 0)
            {
                throw new Error("No test case specified");
            }

            logger.success(`Get test case success`);

            logger.info(JSON.stringify(testCases, null, 2));

            const randomBoxId = generateRandomBoxId();

            while(true) {
                const boxIsExists = await checkBoxAlreadyExists(randomBoxId);
                if(boxIsExists)
                    randomBoxId = generateRandomBoxId();
                else
                    break;
            }
            const boxid = randomBoxId

            await createIsolateBox(boxid);

            const sourceCodePath = `${BOX_DIR_PREFIX}${boxid}/box/${FILENAME}.${sourceCodeExtension}`;
            await copyFile(`${DEFAULT_JUDGER_PATH}${judger.FileName}`, `${BOX_DIR_PREFIX}${boxid}/box/${judger.FileName}`);

            await writeSourceCode(sourceCodePath,sourceCode);
            let testResults = [];
            try {
                await compileSubmissionSourceCode(boxid, paramAppliedCompileCommand);

                const compileResult = await verifySubmissionCompileResult(boxid);
                logger.success(`Get compilation result success`);
                logger.info(compileResult);

                const testCasesWithJudgeStatus = await judgeSubmissionTestcases(boxid, testCases, programmingLanguageSpec, exerciseSpec, judger);
                testResults = await getTestResultWithSuccess(boxid, testCasesWithJudgeStatus, exerciseSpec);
            }
            catch (err)
            {
                logger.error(err);
                testResults = await getTestResultWithCompilationError(boxid, testCases);
            }

            await updateSubmissionTestResultSql(submissionId, JSON.stringify(testResults));
            
            await cleanIsolateBox(boxid);

            logger.success('Success judged the submission');
            logger.info(JSON.stringify(testResults, null, 2));

            return;
        }
        catch (err)
        {
            throw err;
        }
    }
}




