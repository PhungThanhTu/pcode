create procedure GetExerciseByDocumentId
    @DocumentId UNIQUEIDENTIFIER
    AS
        select 
            Id,
            RuntimeLimit,
            MemoryLimit,
            ScoreWeight,
            TimeCreated,
            HaveDeadline,
            Deadline,
            StrictDeadline,
            ManualPercentage,
            JudgerId         
        from [dbo].[Exercise] e
        join [dbo].[DocumentExercise] de
        on e.Id = de.ExerciseId
        where de.DocumentId = @DocumentId