CREATE PROCEDURE UpdateSubmissionResult
    @jsonJudgeData nvarchar(max),
    @submissionId uniqueidentifier,
    @programmingLanguageId INT
    AS
        MERGE into [dbo].[SubmissionTestResult]
        AS DestinationTable
            USING
            (
                select submissionId = @submissionId, programmingLanguageId = @programmingLanguageId, *  from openjson(@jsonJudgeData) with 
                (
                    testId UNIQUEIDENTIFIER '$.testId',
                    runTime float '$.runTime',
                    memoryUsage int '$.memoryUsage',
                    runStatus int '$.runStatus',
                    exitCode int '$.exitCode',
                    actualStdout nvarchar(max) '$.actualOutput',
                    stdErr nvarchar(max) '$.errorOutput'
                )
            ) AS UpsertingData
        ON DestinationTable.testId = UpsertingData.testId 
            AND DestinationTable.submissionId = UpsertingData.submissionId 
            AND DestinationTable.programmingLanguageId = UpsertingData.programmingLanguageId 
        WHEN MATCHED THEN
            UPDATE SET
                DestinationTable.runTime = UpsertingData.runTime,
                DestinationTable.memoryUsage = UpsertingData.memoryUsage,
                DestinationTable.runStatus = UpsertingData.runStatus,
                DestinationTable.exitCode = UpsertingData.exitCode,
                DestinationTable.actualStdout = UpsertingData.actualStdout,
                DestinationTable.stdErr = UpsertingData.stdErr
        WHEN NOT MATCHED THEN
            INSERT (submissionId,testId, programmingLanguageId ,runTime,memoryUsage,runStatus,exitCode,actualStdout,stdErr)
            VALUES (
            UpsertingData.submissionId,
            UpsertingData.testId,
            UpsertingData.programmingLanguageId,
            UpsertingData.runTime,
            UpsertingData.memoryUsage,
            UpsertingData.runStatus,
            UpsertingData.exitCode,
            UpsertingData.actualStdout, 
            UpsertingData.stdErr
            );
