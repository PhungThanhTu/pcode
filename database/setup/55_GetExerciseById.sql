create procedure GetExerciseById
    @Id UNIQUEIDENTIFIER
    AS
        select 
            Id,
            RuntimeLimit,
            MemoryLimit,
            ScoreWeight,
            TimeCreated,
            HaveDeadline,
            StrictDeadline,
            ManualPercentage,
            JudgerId
        from [dbo].[Exercise]
        where Id = @Id