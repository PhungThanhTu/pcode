create procedure CreateSubmissionInDocument
    @Id UNIQUEIDENTIFIER,
    @DocumentId UNIQUEIDENTIFIER,
    @UserId UNIQUEIDENTIFIER,
    @ProgrammingLanguageId INT,
    @SourceCode NVARCHAR(max)
    AS
    DECLARE @ExerciseId UNIQUEIDENTIFIER
    SELECT @ExerciseId = [ExerciseId] from [dbo].[DocumentExercise]
        where [DocumentId] = @DocumentId
    INSERT INTO [dbo].[Submission]
    (
        Id,
        ExerciseId,
        ProgrammingLanguageId,
        SourceCode,
        Pending,
        TimeCreated,
        Choice,
        AutomatedScore,
        ManualScore
    )
    VALUES
    (
        @Id,
        @ExerciseId,
        @ProgrammingLanguageId,
        @SourceCode,
        1,
        GETDATE(),
        0,
        0,
        0
    )
    INSERT INTO [dbo].[SubmissionUser]
    (
        SubmissionId,
        UserId
    )
    VALUES
    (
        @Id,
        @UserId
    )