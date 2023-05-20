create procedure GetSingleSubmission
    @SubmissionId UNIQUEIDENTIFIER
    AS
    select 
        Id, 
        ExerciseId, 
        ProgrammingLanguageId ,
        SourceCode,
        AutomatedScore,
        Pending,
        Choice,
        TimeCreated,
        ManualScore,
        Score
    from [dbo].[Submission]
        where Id = @SubmissionId