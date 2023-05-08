create table TestResult (
    SubmissionId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Submission](Id),
    TestId int,
    [Time] int,
    [Memory] int,
    [Output] nvarchar(max),
    ExitCode int,
    RunStatus int
)
