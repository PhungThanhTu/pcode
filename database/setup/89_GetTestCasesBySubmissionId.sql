create procedure GetTestCasesBySubmissionId
    @SubmissionId UNIQUEIDENTIFIER
    AS
    DECLARE @ExerciseId UNIQUEIDENTIFIER
    SELECT @ExerciseId = ExerciseId FROM [dbo].[Submission]
    WHERE Id = @SubmissionId
    Select
    Id,
    ExerciseId,
    [Input],
    ExpectedOutput as [Output],
    ScoreWeight,
    Visibility,
    TestOrder
    FROM [dbo].[TestCase]
    WHERE ExerciseId = @ExerciseId
    ORDER BY TestOrder ASC