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
            ManualPercentage
        from [dbo].[Exercise]
        where Id = @Id