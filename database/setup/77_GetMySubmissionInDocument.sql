create procedure GetMySubmissionsInDocument
    @DocumentId UNIQUEIDENTIFIER,
    @UserId UNIQUEIDENTIFIER
    AS
    DECLARE @ExerciseId UNIQUEIDENTIFIER
    SELECT @ExerciseId = [ExerciseId] from [dbo].[DocumentExercise]
        where [DocumentId] = @DocumentId
    select 
        Id, 
        ExerciseId, 
        ProgrammingLanguageId ,
        SourceCode,
        AutomatedScore,
        Pending,
        Choice,
        TimeCreated
    from [dbo].[Submission] S 
    join [dbo].[SubmissionUser] SU
    on S.Id = SU.SubmissionId
    Where SU.UserId = @UserId
    and S.ExerciseId = @ExerciseId