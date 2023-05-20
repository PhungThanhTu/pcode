create procedure GetTestResultsBySubmissionId
    @SubmissionId UNIQUEIDENTIFIER
    as
    select
    [SubmissionId],
    TestId,
    [Time],
    Memory,
    ExitCode,
    Deadline,
    [Input],
    [Output],
    ExpectedOutput,
    RunStatus
    from [dbo].[TestResult] TR
    join [dbo].[Submission] S
    on TR.SubmissionId = S.Id
    join [dbo].[Exercise] E 
    on E.Id = S.ExerciseId
    join [dbo].[TestCase] TC 
    on TC.ExerciseId = E.Id and TC.Id = TR.TestId
    where [SubmissionId] = @SubmissionId