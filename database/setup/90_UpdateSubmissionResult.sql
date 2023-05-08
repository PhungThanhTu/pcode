CREATE PROCEDURE UpdateSubmissionResult
    @jsonJudgeData nvarchar(max),
    @submissionId uniqueidentifier
    AS
        MERGE into [dbo].[TestResult] AS DestinationTable
            USING
            (
                select @submissionId as SubmissionId ,*  from openjson(@jsonJudgeData) 
                with 
                (
                    TestId int '$.TestId',
                    [Time] float '$.Time',
                    [Memory] int '$.Memory',
                    [Output] NVARCHAR(max) '$.Output',
                    ExitCode int '$.ExitCode',
                    RunStatus int '$.RunStatus'
                )
            ) as UpsertingData
        ON DestinationTable.TestId = UpsertingData.TestId
        AND DestinationTable.SubmissionId = UpsertingData.SubmissionId 
        WHEN MATCHED THEN
            UPDATE SET
                DestinationTable.Time = UpsertingData.Time,
                DestinationTable.Memory = UpsertingData.Memory,
                DestinationTable.Output = UpsertingData.Output,
                DestinationTable.ExitCode = UpsertingData.ExitCode,
                DestinationTable.RunStatus = UpsertingData.RunStatus
        WHEN NOT MATCHED THEN
            INSERT (SubmissionId, TestId, [Time], [Memory], [Output], [ExitCode], [RunStatus])
            VALUES (
            UpsertingData.SubmissionId,
            UpsertingData.TestId,
            UpsertingData.[Time],
            UpsertingData.[Memory],
            UpsertingData.[Output],
            UpsertingData.[ExitCode],
            UpsertingData.[RunStatus]
        );