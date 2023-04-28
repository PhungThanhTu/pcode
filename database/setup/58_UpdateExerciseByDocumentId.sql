create procedure UpdateExerciseByDocumentId
    @DocumentId UNIQUEIDENTIFIER,
    @RuntimeLimit int = NULL,
    @MemoryLimit int = NULL,
    @ScoreWeight int = NULL,
    @HaveDeadline bit = NULL,
    @Deadline datetime2 = NULL,
    @StrictDeadline bit = NULL,
    @ManualPercentage float = NULL
    AS
        update [dbo].[Exercise]
        SET
            RuntimeLimit = COALESCE(@RuntimeLimit, RuntimeLimit),
            MemoryLimit = COALESCE(@MemoryLimit, MemoryLimit),
            ScoreWeight = COALESCE(@ScoreWeight, ScoreWeight), 
            HaveDeadline = COALESCE(@HaveDeadline, HaveDeadline),
            Deadline = COALESCE(@Deadline, Deadline),
            StrictDeadline = COALESCE(@StrictDeadline, StrictDeadline),
            ManualPercentage = COALESCE(@ManualPercentage, ManualPercentage)
        FROM [dbo].[Exercise] E
        JOIN [dbo].[DocumentExercise] DE
        ON E.Id = DE.ExerciseId
        WHERE DE.DocumentId = @DocumentId