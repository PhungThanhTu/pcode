create procedure UpdateExerciseById
    @Id UNIQUEIDENTIFIER,
    @RuntimeLimit int,
    @MemoryLimit int,
    @ScoreWeight int,
    @HaveDeadline bit,
    @Deadline datetime2,
    @StrictDeadline bit,
    @ManualPercentage float,
    @JudgerId UNIQUEIDENTIFIER
    AS
        update [dbo].[Exercise]
        SET
            RuntimeLimit = @RuntimeLimit,
            MemoryLimit = @MemoryLimit,
            ScoreWeight = @ScoreWeight,
            HaveDeadline = @HaveDeadline,
            Deadline = @Deadline,
            StrictDeadline = @StrictDeadline,
            ManualPercentage = @ManualPercentage,
            JudgerId = @JudgerId
        WHERE
            Id = @Id