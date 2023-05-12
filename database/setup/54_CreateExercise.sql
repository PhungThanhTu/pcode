create procedure CreateExerciseInDocument
    @Id UNIQUEIDENTIFIER,
    @DocumentId UNIQUEIDENTIFIER,
    @RuntimeLimit INT,
    @MemoryLimit INT,
    @ScoreWeight INT,
    @ManualPercentage FLOAT,
    @JudgerId UNIQUEIDENTIFIER
    AS
        INSERT INTO [dbo].[Exercise]
        (Id, RuntimeLimit, MemoryLimit, ScoreWeight, TimeCreated, ManualPercentage, HaveDeadline, JudgerId)
        VALUES
        (@Id, @RuntimeLimit, @MemoryLimit, @ScoreWeight, GETDATE(), @ManualPercentage, 0, @JudgerId)
        INSERT INTO [dbo].[DocumentExercise]
        (DocumentId, ExerciseId)
        VALUES
        (@DocumentId, @Id)