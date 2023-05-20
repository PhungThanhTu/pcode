CREATE TRIGGER [dbo].[OnTestResultUpsert]
ON [dbo].[TestResult]
AFTER INSERT, DELETE
AS
BEGIN
    declare @SubmissionId UNIQUEIDENTIFIER
    declare @TestId INT
    select @SubmissionId = SubmissionId from inserted
    select @TestId = TestId from inserted
    declare @UserId UNIQUEIDENTIFIER
    select @UserId = UserId from [dbo].[SubmissionUser]
        where SubmissionId = @SubmissionId
    declare @ExerciseId UNIQUEIDENTIFIER
    select @ExerciseId = ExerciseId from [dbo].[Submission]
        where Id = @SubmissionId
    declare @RawScore INT
    select @RawScore = sum(ScoreWeight) from [dbo].[TestCase] TC 
        join [dbo].[TestResult] TR
        on TC.Id = TR.TestId
        where TR.SubmissionId = @SubmissionId
        and TR.RunStatus = 1
        and TC.ExerciseId = @ExerciseId
    declare @MaxRawScore int 
    select @MaxRawScore = sum(ScoreWeight) from [dbo].[TestCase] TC 
        where ExerciseId = @ExerciseId
    declare @AutomatedScore float = @RawScore * 10.0 / @MaxRawScore 
    update [dbo].[Submission]
        set AutomatedScore = @AutomatedScore
        where Id = @SubmissionId
END