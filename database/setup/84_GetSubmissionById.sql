create procedure GetSubmissionById
    @Id UNIQUEIDENTIFIER
    as
    SELECT
    Id,
    ExerciseId,
    ProgrammingLanguageId,
    SourceCode
    from [dbo].[Submission]
    where Id = @Id